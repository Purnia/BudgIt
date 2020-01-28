
//will include our budget data 
var budgetController = (function(){

    var Expense = function(id, description, value) {
        this.id= id;
        this.description= description;
        this.value= value;
    };

    var Income = function(id, description, value) {
        this.id= id;
        this.description= description;
        this.value= value;
    };


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0,
        }
    };

    //adding a public method so other controllers can add items 
    return {
        addItem: function(type, des, val){
            var newItem;
//create new id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
//create new itme based on inc or exp
            if(type ==='exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val)
            }
//push to data structure
            data.allItems[type].push(newItem)
//return new item
            return newItem;
           

        },

        testing: function(){
            console.log(data);
        }
    };

})();




//will include our UI
var UIController = (function(){
//creating a domstrings object so if i want to change out the class name i just have to do it here
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    }

    return {
        getInput: function(){
            return {

                type: document.querySelector(DOMstrings.inputType).value, //inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };

        },

        addListItem: function(obj, type) {
            var html, newHtml, element;
            //create HTML string with placeholder text

            if(type === 'inc'){
            element = DOMstrings.incomeContainer;
           html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = DOMstrings.expenseContainer;
          html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
          //replace placeholder with actual data 
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value', obj.value);

            //insert html to dom 
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearFields: function() {
            var fields;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            //the response you get with queryselsctorall is a list not an array. so convert using slice
            //use the slice method store in the constructor arrays protype and pass fields into (tricking it into believeing fields is n array)
            var fieldsArray = Array.prototype.slice.call(fields)

            fieldsArray.forEach(function(current, index, array){
                current.value = "";
            });

            fieldsArray[0].focus();

        },

        //return domstrings so you have access to these values outside as well 

        getDomstrings: function(){
            return DOMstrings;
        }
    };

})();




//Global app controller. will contain interaction of data and UI
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function (){
        var DOM = UICtrl.getDomstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
            
            if(event.key === 13) {
                ctrlAddItem();
            }
        });
    };

    var updateBudget = function() {
        // 1. calculate budget

        // 2. Return the budget

        // 3. Display the budget on the UI 
    };



    var ctrlAddItem = function() {
    // 1. get field input data

    var input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) 
    {
        // 2. add item to budget controller
    var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    // 3. add new item to UI
    UICtrl.addListItem(newItem, input.type);
    //4. clear fields
    UICtrl.clearFields();
    // 4. calc budget and uodate budget

    updateBudget();
    }
    
    };

    return {
        init: function(){
            console.log('app has started');
            setupEventListeners();
        }
    }



})(budgetController, UIController);

controller.init();