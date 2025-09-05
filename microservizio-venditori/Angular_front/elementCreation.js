function addItem(content){
    var listItem = document.createElement("li");
    var text = document.createTextNode(content.value);
        listItem.appendChild(text);
    var checkAttribute = document.createAttribute("class");
        checkAttribute.value = "checked";
    listItem.addEventListener("click", function(){
        listItem.setAttributeNode(checkAttribute)
    });
    document.getElementById("shopping").appendChild(listItem)
}