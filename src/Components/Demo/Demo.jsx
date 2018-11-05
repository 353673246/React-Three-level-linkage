import React from 'react'
import './Demo.scss'

// 引用外部文件
import {area, areap} from './AreaData_min'

class Demo extends React.Component{

    constructor(props){
        super(props)
        this.state={
            pArea : [],
            cArea : [],
            aArea : [],

            touchStop : true,
            touchBegin : true,
            movePosition : {
                x : 0,
                y : 0
            },
            startPosition : {
                x : 0,
                y : 0
            },
            endPosition : {
                x : 0,
                y : 0
            }
        }
    }

    componentDidMount(){
        this.setState({
            pArea : areap,
            cArea : areap[0].city,
            aArea : areap[0].city[0].area
        })
        
    }

    translateXY(obj){
        var beeTransform = obj.style.transform.replace(/\s/g,'');
			beeTransform = beeTransform.replace('translateY','');
			beeTransform = beeTransform.slice(1,-1);
			beeTransform = beeTransform.replace('px','');
			return beeTransform;
    }

    getArea(){
        console.log(this.refs.item1.querySelectorAll('span')[0].innerHTML);
        console.log(this.refs.item2.querySelectorAll('span')[0].innerHTML);
        console.log(this.refs.item3.querySelectorAll('span')[0].innerHTML);
        if(!this.state.pAr){
            console.log('object');
            this.refs.info.innerHTML = this.refs.item1.querySelectorAll('span')[0].innerHTML + '+' +this.refs.item2.querySelectorAll('span')[0].innerHTML + '+' + this.refs.item3.querySelectorAll('span')[0].innerHTML
        }
        else{
            this.refs.info.innerHTML = this.state.pAr + '+' + this.state.cAr + "+" + this.state.aAr
        }
        

    }

    objTouchEnd(e){
        var item1 = this.refs.item1
        var Item = this.state.Item
        var _this = this
        var objTranslateY = parseInt(Number(this.translateXY(Item)))
        var objType = ""
        if(this.state.endPosition.y - this.state.startPosition.y > 0){
            objType  = "down"
        }else{
            objType = "up"
        }
        this.timer = setInterval(function(){
            if(objType == 'up'){
                if(Number(_this.translateXY(Item)) % 40 != 0 ){
                    objTranslateY -= 1
                }
            }
            if(objType == 'down'){
                if(Number(_this.translateXY(Item)) % 40 != 0){
                    objTranslateY += 1
                    
                }
            }
            

            Item.style.transform = 'translateY(' + objTranslateY + 'px)';


            if(Number(_this.translateXY(Item)) % 40 === 0){
                clearInterval(_this.timer)

                if(Item.className === "item1"){
                    var oneNum  = Math.abs((objTranslateY - 80) / 40)
                    var one = Item.querySelectorAll('span')[oneNum]
                    _this.setState({
                        touchBegin : false,
                        pAr : one.innerHTML,
                        cAr : areap[oneNum].city[0].name,
                        aAr : areap[oneNum].city[0].area[0],
                        cArea : areap[oneNum].city,
                        aArea : areap[oneNum].city[0].area
                    })
                    _this.refs.item2.style.transform = "translateY(80px)"
                    _this.refs.item3.style.transform = "translateY(80px)"
                }
                if(Item.className === "item2"){
                    // console.log('item2');
                    var oneNum  = Math.abs((objTranslateY - 80) / 40)
                    var one = Item.querySelectorAll('span')[oneNum]
                    _this.refs.item3.style.transform = "translateY(80px)"
                    // console.log(_this.state.pArea);
                    console.log(_this.state.cArea[oneNum].area[0]);
                    _this.setState({
                        cAr : one.innerHTML,
                        aAr : _this.state.cArea[oneNum].area[0],
                        touchBegin:false,
                        aArea : _this.state.cArea[oneNum].area
                    })
                }
                if(Item.className === "item3"){
                    var oneNum  = Math.abs((objTranslateY - 80) / 40)
                    var one = Item.querySelectorAll('span')[oneNum]
                    console.log(one.innerHTML);
                    _this.setState({
                        aAr : one.innerHTML,
                        touchBegin:false
                    })
                }
                // console.log(one1.innerHTML + "+" + one2.innerHTML)
            }
        },20)
    }

    TouchS(e){
        var item1 = this.refs.item1
        var Item = e.target.parentNode
        // console.log(Item.className);
        this.setState({
            Item : e.target.parentNode
        })
        clearTimeout(this.Time)
        if(this.state.touchStop){
            this.setState({
                touchStop : false
            })
            var touch = e.touches[0]
            this.setState({
                startPosition:{
                    x : touch.pageX,
                    y : touch.pageY
                }
            })
            var transY = Number(this.translateXY(Item))
            var objHeight = Item.offsetHeight
            this.setState({
                transY : transY,
                touchBegin : true,
                objHeight : objHeight
            })
        }

    }
    TouchM(e){
        var item1 = this.refs.item1
        var Item = e.target.parentNode
        if(this.state.touchBegin){
            this.setState({
                touchOn : true
            })
            var touch = e.touches[0]
            var movePosition = {
                x : touch.pageX,
                y : touch.pageY
            }
            this.setState({
                movePosition : movePosition
            })
            var delateY = this.state.movePosition.y - this.state.startPosition.y + this.state.transY
            var delateY = delateY > -this.state.objHeight + 120 ? delateY : -this.state.objHeight + 120
            var delateY = delateY > 80 ? 80 : delateY
            Item.style.transform = 'translateY('+ delateY + 'px)'
        }
    }
    TouchE(e){
        var _this = this
        var Item = e.target.parentNode
        if(this.state.touchOn){
            this.setState({
                touchStop : true
            })
            var touch = e.changedTouches[0]
            var endPosition = {
                x : touch.pageX,
                y : touch.pageY
            }
            this.setState({
                endPosition : endPosition
            })
            this.Time = setTimeout(function(){
                _this.objTouchEnd()
            },100)

        }
    }

    render(){
        return(
            <div className="DemoWrap">
                <h1>三级联动</h1>

                <p className="React-Name" ref="info">请选择</p>

                <div className="DemoMainWrap">
                    <div className="addListArea">
                        <header>
                            <span className="left" >取消</span>
                            <span className="right" onClick={this.getArea.bind(this)}>确定</span>
                        </header>
                        
                        <main>
                            <div className="current"></div>
                            <div 
                                ref="item1"
                                className="item1" 
                                style={{transform : `translateY(${80}px)`}} 
                                onTouchStart={this.TouchS.bind(this)} 
                                onTouchMove={this.TouchM.bind(this)} 
                                onTouchEnd = {this.TouchE.bind(this)}
                            >
                                {
                                    this.state.pArea.map(function(item,index){
                                        return <span key={index} data-id = {index}>{item.name}</span>
                                    })
                                }

                            </div>
                            <div 
                                ref="item2"
                                className="item2" 
                                style={{transform : `translateY(${80}px)`}} 
                                onTouchStart={this.TouchS.bind(this)} 
                                onTouchMove={this.TouchM.bind(this)} 
                                onTouchEnd = {this.TouchE.bind(this)}
                            >
                                
                                {
                                    this.state.cArea.map(function(item,index){
                                        return <span key={index} data-id = {index}>{item.name}</span>
                                    })
                                }
                                
                            </div>
                            <div 
                                ref="item3"
                                className="item3" 
                                style={{transform : `translateY(${80}px)`}} 
                                onTouchStart={this.TouchS.bind(this)} 
                                onTouchMove={this.TouchM.bind(this)} 
                                onTouchEnd = {this.TouchE.bind(this)}
                            >
                                {
                                    this.state.aArea.map(function(item,index){
                                        return <span key={index} data-id = {index}>{item}</span>
                                    })
                                }
                            </div>
                        </main>

                    </div>
                </div>
            </div>
        )
    }
}
export default Demo
