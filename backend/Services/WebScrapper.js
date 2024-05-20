const puppeteer = require('puppeteer')

const MakeGoogleSearch = async(query) => {
    const browser = await puppeteer.launch({
        headless : true
    })

    //new page
    const page = await browser.newPage();
    const SearchQuery = encodeURIComponent(query);
    const SearchURL = `https://www.google.com/search?q=${SearchQuery}`

    //go to search url
    console.log("Searching for : "+query+" ...")
    await page.goto(SearchURL);
    await page.waitForSelector('div.g')//awaiting for results to load

    const SearchResults = await page.evaluate(()=>{
        const results = [];
        const elements = document.querySelectorAll('div.g');
        elements.forEach((ele, index) => {
            if (index < 1) { // Limit to 2 results
                const titleEle = ele.querySelector('h3');
                const title = titleEle ? titleEle.textContent : null;
                const urlElement = ele.querySelector('a[href^="http"]');
                const url = urlElement ? urlElement.href : null; // Extract URL
                if (title && url) {
                    results.push({ title, url });
                }
            }
        });

        return results;
    })

    await browser.close();

    return SearchResults;
}

const ScrapeData = async (topic) => {
    // Make Google Search
    const SearchResults = await MakeGoogleSearch(topic);
  
    // Collect data from all search results
    const scrapedData = await Promise.all(SearchResults.map(async (item) => {
      const browser = await puppeteer.launch({ headless: true }); // headless: true for non-UI mode
      const page = await browser.newPage();
      try {
        // Navigate to the provided URL
        await page.goto(item.url);
        await page.waitForSelector('body'); // Wait for the page to load
  
        // Extract text content from specific elements on the page
        const textContent = await page.evaluate(() => {
          const selectors = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'span'];
          const texts = [];
          selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
              texts.push(element.textContent.trim());
            });
          });
          // Join the texts, replacing multiple consecutive whitespace characters with a single space
          return texts.join('\n').replace(/\s+/g, ' ');
        });
  
        // Extract image URLs from the page
        const imageUrls = await page.evaluate(() => {
          const imageElements = document.querySelectorAll('img');
          const urls = Array.from(imageElements).map(element => element.src);
          return urls;
        });
  
        return { textContent, imageUrls };
      } catch (error) {
        console.error("Error:", error);
        return { textContent: null, imageUrls: [] };
      } finally {
        await browser.close();
      }
    }));
  
    //console.log(scrapedData);
    return scrapedData;
  };


  const scrapeImages = async (searchQuery) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
  
    try {
      // Navigate to Google Images
      const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchQuery)}`;
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });
  
      // Scroll the page to load more images
      for (let i = 0; i < 3; i++) { // Adjust the number of scrolls as needed
        await page.evaluate(() => {
          window.scrollBy(0, window.innerHeight);
        });
        await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the delay as needed
      }
  
      // Extract image URLs
      const imageUrls = await page.evaluate(() => {
        const imageElements = document.querySelectorAll('img');
        const urls = Array.from(imageElements)
          .map(img => img.src)
          .filter(src => src && src.startsWith('http'));
        return urls;
      });
  
      console.log('Scraped Image URLs:', imageUrls);
      return imageUrls;
    } catch (error) {
      console.error('Error:', error);
      return [];
    } finally {
      await browser.close();
    }
  };
    
    module.exports = {MakeGoogleSearch, ScrapeData, scrapeImages}