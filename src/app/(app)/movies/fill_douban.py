import json
import time
import random
import re
import requests
from datetime import datetime
from pathlib import Path

INPUT = Path("douban-watched.json")
OUTPUT = Path("douban-watched-filled.json")
LOG_FILE = Path("douban-fill.log")
PROGRESS_FILE = Path("douban-progress.json")

HEADERS = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "max-age=0",
    "cookie": "bid=0DTiYPLIMtc; ll=\"108291\"; _vwo_uuid_v2=D6929A88ABB92514025C8F660D348CA67|71e760a74e204b66516330ae3962dcf4; push_noty_num=0; push_doumail_num=0; _ck_desktop_mode=1; vmode=pc; dbcl2=\"70894310:3zphmjEp81c\"; ck=xvoe; frodotk_db=\"ff64965e8683c45efe2dc31b938b4d1a\"",
    "dnt": "1",
    "referer": "https://movie.douban.com/",
    "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
}

GENRE_PRIORITY = [
    "动画", "剧情", "喜剧", "动作", "爱情", "悬疑", "惊悚", "恐怖",
    "犯罪", "科幻", "奇幻", "冒险", "战争", "历史", "传记", "家庭",
    "音乐", "歌舞", "运动", "纪录片"
]


def log(msg):
    line = f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}"
    print(line)
    with LOG_FILE.open("a", encoding="utf-8") as f:
        f.write(line + "\n")


def load_json(path):
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path, data):
    tmp = path.with_suffix(".tmp")
    with tmp.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    tmp.replace(path)


def save_progress(index, item, reason=""):
    save_json(PROGRESS_FILE, {
        "index": index,
        "title": item.get("title"),
        "href": item.get("href"),
        "reason": reason,
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })


def need_fill(item):
    return (
        not item.get("poster")
        or item.get("doubanRating") is None
        or item.get("year") is None
        or not item.get("genres")
        or item.get("type") is None
    )


def sleep_random():
    seconds = random.randint(7, 13)
    log(f"等待 {seconds}s")
    time.sleep(seconds)


def fetch(url):
    r = requests.get(
        url,
        headers=HEADERS,
        allow_redirects=True,
        timeout=30
    )
    r.encoding = r.apparent_encoding
    html = r.text or ""

    if r.status_code != 200:
        raise Exception(f"HTTP {r.status_code}")

    if "error code: 004" in html or "please Login" in html or "please login" in html:
        raise Exception("触发反爬或 Cookie 失效：error code 004")

    if "sec.douban.com" in r.url or "captcha" in html or "验证码" in html:
        raise Exception(f"触发验证码：{r.url}")

    if "accounts.douban.com" in r.url:
        raise Exception(f"跳转登录页：{r.url}")

    if "<title>302 Found</title>" in html:
        raise Exception("返回 302 Found 页面")

    return html


def parse_ld_json(html):
    m = re.search(
        r'<script[^>]+type=[\'"]application/ld\+json[\'"][^>]*>(.*?)</script>',
        html,
        re.S
    )
    if not m:
        return None

    raw = m.group(1).strip()

    try:
        return json.loads(raw)
    except Exception:
        raw = re.sub(r",\s*([}\]])", r"\1", raw)
        try:
            return json.loads(raw)
        except Exception:
            return None


def clean_html_text(s):
    s = re.sub(r"<[^>]+>", "", s or "")
    s = s.replace("&nbsp;", " ")
    return re.sub(r"\s+", " ", s).strip()


def pick_genres(genres):
    if not genres:
        return []

    genres = list(dict.fromkeys([g.strip() for g in genres if g and g.strip()]))

    picked = []

    if "动画" in genres:
        picked.append("动画")

    for g in GENRE_PRIORITY:
        if g in genres and g not in picked:
            picked.append(g)
        if len(picked) >= 3:
            return picked

    for g in genres:
        if g not in picked:
            picked.append(g)
        if len(picked) >= 3:
            break

    return picked


def parse_poster(html, ld):
    if ld and ld.get("image"):
        return ld["image"].replace(".webp", ".jpg")

    m = re.search(r'<meta property="og:image" content="([^"]+)"', html)
    if m:
        return m.group(1).replace(".webp", ".jpg")

    m = re.search(r'<div id="mainpic"[\s\S]*?<img[^>]+src="([^"]+)"', html)
    if m:
        return m.group(1).replace(".webp", ".jpg")

    return None


def parse_rating(html, ld):
    try:
        v = ld.get("aggregateRating", {}).get("ratingValue") if ld else None
        if v is not None:
            return float(v)
    except Exception:
        pass

    m = re.search(r'<strong[^>]+property="v:average"[^>]*>([\d.]+)</strong>', html)
    if m:
        return float(m.group(1))

    m = re.search(r'<strong[^>]+class="[^"]*rating_num[^"]*"[^>]*>([\d.]+)</strong>', html)
    if m:
        return float(m.group(1))

    return None


def parse_year(html, ld):
    if ld and ld.get("datePublished"):
        m = re.search(r"\d{4}", str(ld["datePublished"]))
        if m:
            return m.group(0)

    m = re.search(r'<span class="year">\((\d{4})\)</span>', html)
    if m:
        return m.group(1)

    return None


def parse_genres(html, ld):
    if ld and isinstance(ld.get("genre"), list):
        return pick_genres(ld["genre"])

    genres = re.findall(r'property="v:genre"[^>]*>([^<]+)<', html)
    return pick_genres(genres)


def parse_episode_count(html):
    m = re.search(r'<span class="pl">集数:</span>\s*(\d+)', html)
    if m:
        return int(m.group(1))

    nums = re.findall(r'/episode/(\d+)/', html)
    if nums:
        return max(map(int, nums))

    return None


def parse_title(html):
    m = re.search(r'<span property="v:itemreviewed">([^<]+)</span>', html)
    return re.sub(r"\s+", " ", m.group(1)).strip() if m else ""


def parse_language(html):
    m = re.search(r'<span class="pl">语言:</span>\s*([^<]+)<', html)
    return re.sub(r"\s+", " ", m.group(1)).strip() if m else ""


def parse_type(html, ld, genres):
    title = parse_title(html)
    language = parse_language(html)

    is_movie = "我看过这部电影" in html
    is_tv = "我看过这部电视剧" in html

    # ===== 你的规则 =====

    # 1. 动画电影
    if is_movie and "动画" in genres:
        return "animation_movie"

    # 2. 普通电影
    if is_movie:
        return "movie"

    # 3. 电视剧
    if is_tv:
        # 布袋戏优先
        if "金光" in title or "霹雳" in title:
            return "budaxi"

        # 动画剧（最高优先级）
        if "动画" in genres:
            return "animation"

        if "韩语" in language:
            return "k_drama"
        if "日语" in language:
            return "j_drama"
        if "粤语" in language:
            return "hk_drama"
        if "汉语普通话" in language:
            return "cn_drama"
        if "英语" in language:
            return "us_drama"

        return "tv"

    return "unknown"


def parse_subject(html):
    ld = parse_ld_json(html)

    poster = parse_poster(html, ld)
    rating = parse_rating(html, ld)
    year = parse_year(html, ld)
    genres = parse_genres(html, ld)
    episode_count = parse_episode_count(html)
    subject_type = parse_type(html, ld, genres)

    return {
        "poster": poster,
        "doubanRating": rating,
        "year": year,
        "genres": genres,
        "type": subject_type,
        "episodeCount": episode_count
    }


def merge_item(item, info):
    if not item.get("poster") and info.get("poster"):
        item["poster"] = info["poster"]

    if item.get("doubanRating") is None and info.get("doubanRating") is not None:
        item["doubanRating"] = info["doubanRating"]

    if item.get("year") is None and info.get("year"):
        item["year"] = info["year"]

    if not item.get("genres") and info.get("genres"):
        item["genres"] = info["genres"]

    if info.get("type"):
        item["type"] = info["type"]

    if info.get("episodeCount"):
        item["episodeCount"] = info["episodeCount"]


def main():
    source_file = OUTPUT if OUTPUT.exists() else INPUT
    data = load_json(source_file)
    items = data.get("watched", [])

    log(f"读取文件：{source_file}")
    log(f"总数：{len(items)}")

    for i, item in enumerate(items):
        if not need_fill(item):
            continue

        title = item.get("title", "")
        href = item.get("href", "")

        log(f"[{i + 1}/{len(items)}] 补全：{title} {href}")

        try:
            html = fetch(href)
            info = parse_subject(html)
            merge_item(item, info)

            save_json(OUTPUT, data)
            save_progress(i, item, "success")

            log(
                f"成功：rating={item.get('doubanRating')} "
                f"year={item.get('year')} "
                f"type={item.get('type')} "
                f"genres={item.get('genres')} "
                f"poster={'yes' if item.get('poster') else 'no'}"
            )

            sleep_random()

        except Exception as e:
            reason = str(e)
            log(f"失败，停止在第 {i + 1} 条：{title}，原因：{reason}")
            save_json(OUTPUT, data)
            save_progress(i, item, reason)
            break

    save_json(OUTPUT, data)
    log(f"完成/已暂停，结果文件：{OUTPUT}")


if __name__ == "__main__":
    main()