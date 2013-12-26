var KanaMaker = (function(){
    function KanaMaker(){
      this.pre = "";
      this.kana = [];
      this.hira = [];
      this.roma = [];
      this.HIRA_MATCHER = /[ぁ-ん]/g;
      this.KANA_MATCHER = /[ァ-ン]/g;
    }
        
    KanaMaker.prototype.eval = function(e){            
      var resource = e.target;
      var text = $(resource).val();

      //check is pressed key alphabet.
      if(e.keyCode == 32){
        if(text.substr(text.length - 1,1).match(/ |　/g)){ this.space();}
        return false;
      }else if(!(65 <= e.keyCode && e.keyCode <= 90)){
        this.pre = text;
        return false;
      }
      
      //add alphabet character
      this.roma.push(String.fromCharCode(e.keyCode));

      //check diff from pre
      var diff = this._makeDiff(this.pre,text);
      //console.log(this.pre + "->" + text + " = diff:" + diff);
      this.pre = text;

      //change all hira to kana.
      var kanas = [];
      var kanaText = diff.replace(this.HIRA_MATCHER,function(c){
        var k = String.fromCharCode(c.charCodeAt(0) + 0x60)
        kanas.push(k);
        return k;
      })

      //add kanas / hiras     
      this.kana = this.kana.concat(kanas);
      for(var i = 0; i < kanas.length; i++){
        var h = String.fromCharCode(kanas[i].charCodeAt(0) - 0x60);
        this.hira.push(h);        
      }
    }
    
    KanaMaker.prototype.space = function(){
      this.kana.push("　");
      this.hira.push("　");
      this.roma.push(" ");
    }
    KanaMaker.prototype.clear = function(){
      this.kana = [];
      this.hira = [];
      this.roma = [];
    }
    KanaMaker.prototype._makeDiff = function(base,now){
      var samePart = "";
      for(var i = 0; i < now.length;i++){
        if(i < base.length && now.charAt(i) == base.charAt(i)){
            samePart += now.charAt(i);
        }
      }
      return now.replace(samePart,"");
    }

    KanaMaker.prototype.getPart = function(name,isLast){ //姓・名のパートを指定して取得
        if(isLast === undefined){//isLastの指定がない場合、そのまま返す
            return name;
        }else{
            var splited = name.split(/ |　/g);
            if(splited.length > 1){//姓・名の登録がある
                return isLast ? splited[0] : splited[splited.length - 1];
            }else{
                return isLast ? name : "";
            }
        }
    }

    KanaMaker.prototype.Kana = function(isLast){
      return this.getPart(this.kana.join(""),isLast);
    }
    KanaMaker.prototype.Hira = function(isLast){
      return this.getPart(this.hira.join(""),isLast);
    }
    KanaMaker.prototype.Roma = function(isLast){
      var names = this.roma.join("").split(" ");
      var result = "";
      for(var i = 0; i < names.length;i++){
          result += ( i > 0 ? " " : "") + names[i].substr(0,1).toUpperCase();
          result += names[i].substr(1).toLowerCase() ;
      }
      return this.getPart(result,isLast);
    }

    return KanaMaker;
  })();
