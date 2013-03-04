
/**
 * Provides suggestions for V1 terms.
 * @class
 * @scope public
 */
function SearchSuggestions() {
    this.searchTxt = [
        "agile",
        "agile benefits",
        "agile development",
        "agile development tools",
        "agile management software",
        "agile management tools",
        "agile methodologies",
        "agile methodology",
        "agile project management",
        "agile project management software",
        "agile project management tool",
        "agile project management tools",
        "agile scrum",
        "agile software",
        "agile software development",
        "agile software development tools",
        "agile software tools",
        "agile tool",
        "agile tools",
        "agile velocity",
        "benefits of agile",
        "extreme programming tools",
        "free agile",
        "microsoft project",
        "project management agile",
        "project management software",
        "scrum",
        "scrum agile",
        "scrum development",
        "scrum management",
        "scrum master",
        "scrum methodology",
        "scrum project management",
        "scrum project management software",
        "scrum software",
        "scrum tool",
        "scrum tools",
        "software development management",
        "software development project",
        "software development project management",
        "what is agile",
        "what is agile development",
        "XP project",
        "XP Project Management"
    ];
}

/**
 * Request suggestions for the given autosuggest control. 
 * @scope protected
 * @param oAutoSuggestControl The autosuggest control to provide suggestions for.
 */
SearchSuggestions.prototype.requestSuggestions = function (oAutoSuggestControl /*:AutoSuggestControl*/,
                                                          bTypeAhead /*:boolean*/) {
    var aSuggestions = [];
    var sTextboxValue = oAutoSuggestControl.textbox.value;
    
    if (sTextboxValue.length > 0){
    
        //search for matching states
        for (var i=0; i < this.searchTxt.length; i++) { 
            if (this.searchTxt[i].indexOf(sTextboxValue) == 0) {
                aSuggestions.push(this.searchTxt[i]);
            } 
        }
    }

    //provide suggestions to the control
    oAutoSuggestControl.autosuggest(aSuggestions, bTypeAhead);
};