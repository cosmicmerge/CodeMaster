

function getLanguageById(language){
      const languageMap={
        "cpp":105,
        "python":109,
         "java":91,
         "javascript":102
      }

      const getLan=language.toLowerCase().trim();
      return languageMap[getLan];
}

export default getLanguageById;