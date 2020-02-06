
//will include our budget data 
var budgetController = (function(){

    var Expense = function(id, description, value) {
        this.id= id;
        this.description= description;
        this.value= value;
        this.percentage= -1;
    };

    Expense.prototype.calPercentage = function(totalIncome){
        if( totalIncome > 0){
        this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

    var Income = function(id, description, value) {
        this.id= id;
        this.description= description;
        this.value= value;
    };

    //private function to total inc or exp
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum += current.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    //adding a public method so other controllers can add items 
    return {
        addItem: function(type, des, val){
            var newItem, ID;
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

        deleteItem: function(type, id){
            var ids, index;

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function(){
            // calculate total income and expenses
        calculateTotal('exp');
        calculateTotal('inc');

            // calculate the budget: income-expenses

            data.budget = data.totals.inc - data.totals.exp
            //calculate perctage of income that we spent
            if (data.totals.inc > 0){
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        } else {
            data.percentage = -1;
        }
        },

        calculatePercentages: function(){

            data.allItems.exp.forEach(function(current){
                current.calPercentage(data.totals.inc);
            });

        },

        getPercentage: function() {
            var allPercentages = data.allItems.exp.map(function(current){
                return current.getPercentage();
            });
            return allPercentages;
        },

        getBudget: function () {
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    };
   
    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;
        /*
        + or - before number
        exactly 2 decimal points
        comma serparation for 1000s


        */
       //to work with the abcolute of the number and removes the sign
       num = Math.abs(num);
       //tofixed if the method of the num prototype. when you use a method on a numb js coverts it into an obj
       num = num.toFixed(2);

       numSplit = num.split('.');

       int = numSplit[0];
       if(int.length > 3) {
           int = int.substr(0, int.length -3) + ',' + int.substr(int.length -3, 3);
       }

       dec = numSplit[1];

       return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
        

    };

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
            // Create HTML string with placeholder text
            
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {
            
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
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

        displayBudget: function(obj){
            var type;
            obj.budget > 0 ? type= 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            

            if (obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '----';
            }

        },


        displayPercentages: function(percentages){

            var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

            var nodeListforEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodeListforEach(fields, function(current, index) {

                if(percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
                
                

            });
    
        },

        displayMonth: function() {
            var now, year, month, months;
            var now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
            

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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem )
    };

    var updateBudget = function() {
        // 1. calculate budget

        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();
        // 3. Display the budget on the UI 
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {

        //1. calculate percentages
        budgetCtrl.calculatePercentages();
       

        //2. read percentages from the budget controller
        var percentages = budgetCtrl.getPercentage();

        //3.update UI
        UICtrl.displayPercentages(percentages);
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

    //cal and update perc

    updatePercentages();
    }
    
    };

    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {

            splitID = itemID.split('-')
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1. delete item from data structure
                budgetCtrl.deleteItem(type, ID);

            //2. delete item from UI
            UICtrl.deleteListItem(itemID);

            //3. update budget and show new budget
            updateBudget();

            //cal and update perc

            updatePercentages();
        }
    };

    return {
        init: function(){
            console.log('app has started');
            UIController.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }



})(budgetController, UIController);

controller.init();