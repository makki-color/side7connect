interface RssItem {
  guid: string;
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
}

export async function fetchGundamNews() {
  const parser = new Parser();
  try {
    const feed = await parser.parseURL('https://www.gundam.info/rss/en.xml');
    return feed.items.map((item: RssItem) => ({
      id: item.guid,
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      description: item.contentSnippet,
    }));
  } catch (err) {
    console.error('RSS fetch error:', err);
    return [];
  }
}