import { extractParams } from "./components/urlParams.js";
const resultsContainer = document.getElementById('results-container');
const searchInput = document.getElementById('search-input');
async function compileElement(){
    const searchParameter = await extractParams()
    const data = await queryApi(searchParameter)
    searchInput.value = searchParameter
    let containerHTML = ""
    if(data.isSuccess){
        const resultElement = (result)=>{
            return ` <div class="result">
                    <h2 class="title"><a href="topic.html" onclick="viewTopic('${result.title}', '${result.date}', '${result.note}', '${result.author}')">${result.title}</a></h2>
                    <p class="description">
                        <span class="date">${result.publicationDate.year}</span> - 
                        <span class="text">${result.description}</span>
                    </p>
                    <p class="author">${result.author}</p>
                </div>`
        }
        const projects = data.data
        for(const project of projects){
            containerHTML += resultElement(project)
        }
        return containerHTML
    }
    containerHTML = `<h1>${data.message}</h1>`
    return containerHTML
}
async function queryApi(searchParameter) {
    const queryBody = {
        "searchKey":searchParameter,
        "searchBy":"title"
    }
    try {
       const results = await fetch(`https://nacos-student-project-repository.onrender.com/api/v1/projects/search/`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(queryBody)
       })
       const data = await results.json();
       return data
    } catch (error) {
        console.error(error.message);
    }
}


async function init(){
    const htmlContents = await compileElement()
    resultsContainer.innerHTML=htmlContents
}

init()