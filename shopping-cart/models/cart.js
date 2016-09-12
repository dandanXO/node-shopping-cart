module.exports= function cart (oldcart){
    this.items = oldcart.items || {};
    this.totlQty = oldcart.totlQty || 0;
    this.totalPrice = oldcart.totalPrice || 0;

    this.add = function (item, id) {
        var sotredItem = this.items[id];
        if(!sotredItem){
            sotredItem = this.items[id]= {item: item, qty: 0, price: 0 };
        }
        sotredItem.qty++;
        sotredItem.price = item.price * sotredItem.qty;
        this.totlQty++;
        this.totalPrice += item.price;
       // console.log( this.items[id].item.price+"SSSSSSSS");
       // console.log(sotredItem.price);
    };
    this.reduceByOnde =function(id){
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totlQty--;
        this.totalPrice -= this.items[id].item.price;

        if(this.items[id].qty<=0){
            delete this.items[id];
        }

    };
    this.removeall = function(id){
          this.totlQty-=this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    }
    this.generatrArray = function () {
           var arr = [];
           for(var id in this.items){
               arr.push(this.items[id]);
           }
           //console.log( arr);
           return arr;
    };
};