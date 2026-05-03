import re
import requests

URL = "https://movie.douban.com/subject/30402296/"

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


def fetch_html(url):
    resp = requests.get(url, headers=HEADERS, timeout=30)
    resp.raise_for_status()
    resp.encoding = resp.apparent_encoding
    return resp.text


def clean_text(text):
    return re.sub(r"\s+", " ", text or "").strip()


def parse_title(html):
    m = re.search(r'<span property="v:itemreviewed">([^<]+)</span>', html)
    return clean_text(m.group(1)) if m else ""


def parse_genres(html):
    return [
        clean_text(x)
        for x in re.findall(r'<span property="v:genre">([^<]+)</span>', html)
        if clean_text(x)
    ]


def parse_language(html):
    m = re.search(
        r'<span class="pl">语言:</span>\s*([^<]+)<',
        html
    )
    return clean_text(m.group(1)) if m else ""


def parse_douban_type(html):
    title = parse_title(html)
    genres = parse_genres(html)
    language = parse_language(html)

    is_movie = "我看过这部电影" in html
    is_tv = "我看过这部电视剧" in html

    # 1. 有“我看过这部电影”且类型有“动画” => 动画电影
    if is_movie and "动画" in genres:
        return "动画电影"

    # 2. 其他“我看过这部电影” => 电影
    if is_movie:
        return "电影"

    # 3. 有“我看过这部电视剧” => 按名称/类型/语言细分
    if is_tv:
        if "金光" in title or "霹雳" in title:
            return "布袋戏"

        # 电视剧且类型包含动画 => 动画
        if "动画" in genres:
            return "动画"

        if "韩语" in language:
            return "韩剧"
        if "日语" in language:
            return "日剧"
        if "粤语" in language:
            return "港剧"
        if "汉语普通话" in language:
            return "国产剧"
        if "英语" in language:
            return "美剧"

        return "电视剧"

    return "未知"


if __name__ == "__main__":
    html = fetch_html(URL)

    title = parse_title(html)
    genres = parse_genres(html)
    language = parse_language(html)
    douban_type = parse_douban_type(html)

    print("URL:", URL)
    print("标题:", title)
    print("类型标签:", " / ".join(genres))
    print("语言:", language)
    print("最终分类:", douban_type)