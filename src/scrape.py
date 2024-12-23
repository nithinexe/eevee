import requests
from transformers import pipeline

# Replace with your API key and endpoint
API_KEY = "your_api_key"
API_URL = "https://api.perplexity.ai/news"

# Function to fetch the latest crypto news
def fetch_crypto_news():
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    params = {
        "category": "crypto",
        "language": "en",
        "pageSize": 5,  # Fetch 5 latest articles
    }

    response = requests.get(API_URL, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching news: {response.status_code}")
        return None

# Function to summarize articles
def summarize_articles(articles):
    summarizer = pipeline("summarization")
    summaries = []

    for article in articles:
        title = article.get("title", "No title")
        content = article.get("content", "No content")

        # Summarize the content
        summary = summarizer(content, max_length=50, min_length=25, do_sample=False)
        summaries.append({
            "title": title,
            "summary": summary[0]['summary_text'] if summary else "No summary available",
        })

    return summaries

# Main script
def main():
    print("Fetching latest crypto news...")
    news_data = fetch_crypto_news()

    if not news_data or "articles" not in news_data:
        print("No news articles found.")
        return

    print("Summarizing articles...")
    articles = news_data["articles"]
    summarized_articles = summarize_articles(articles)

    print("\nSummarized Crypto News:")
    for idx, article in enumerate(summarized_articles):
        print(f"{idx + 1}. {article['title']}")
        print(f"   Summary: {article['summary']}\n")

if __name__ == "__main__":
    main()
