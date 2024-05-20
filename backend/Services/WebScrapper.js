const MakeGoogleSearch = async(query) =>{
    console.log("Searching for "+query)
    return {
        search_result : "I found something new"
    }
}

const ScrapeData = async(options) => {
    console.log("I will scrape these :"+options)
    return {
        search_result : "I found something new"
    }
}

module.exports = {MakeGoogleSearch, ScrapeData}