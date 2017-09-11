require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';
var imageDatas = require('json!../../data/imageData.json');

function getImageURL(imageDataArr) {
	for(var i = 0, j = imageDataArr.length; i < j; i++) {
		var singleImageData = imageDataArr[i];
		singleImageData.imageURL = require('../../dist/static/' + singleImageData.fileName);
		imageDataArr[i] = singleImageData;
	}
	return imageDataArr;
}
imageDatas = getImageURL(imageDatas);
/**
 * 获取区间内的随机值
 */
function getRangeRandom(low,high){
	return Math.floor(Math.random()*(high-low)+low);
}
/**
 * 
 */
function get30Rangedom(){
	return ((Math.random()>0.5?'':'-') + Math.floor(Math.random()*30));
}
//单个图片组件
class ImgFigure extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e){
  	if(this.props.arrange.isCenter){
  		this.props.inverse();
  	}else{
  		this.props.center();
  	}
  	
  	e.stopPropagation();
  	e.preventDefault();
  }
  render() {
  	 var styleObj = {};
    //如果props属性中指定了这张图片的位置,则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    //如果图片的旋转角度有值并且不为0，添加旋转角度
    if(this.props.arrange.rotate){
    	['-moz-','-ms-','-webkit-',''].forEach(function(value)
    	{
    		styleObj[value+'transform']='rotate('+this.props.arrange.rotate+'deg)';
    	}.bind(this));
    	
    }
    if(this.props.arrange.isCenter){
    	styleObj.zIndex=102;
    }
    var imgFiguerClassName="img-figure";
        imgFiguerClassName+=this.props.arrange.isInverse?' is-inverse':'';
    return (
      <figure className={imgFiguerClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL} 
              alt={this.props.data.title}
              className="img"
        />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>handleClick
           <p>
            {this.props.data.desc}
           </p>
          </div>
        </figcaption>
      </figure>
    );
  }
};
class ControllerUnit extends React.Component{
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	};
	handleClick(e){
		//如果点击的是当前正在选中态的按钮，则翻转图片，负责将对应图片居中
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		e.preventDefalult();
		e.stopPropagation();
	};
	render(){
		var controllerunitClassName="controller-unit";
		//如果对应的是居中图片，显示控制按钮的居中态
		if(this.props.arrange.isCenter){
			controllerunitClassName+=" is-center";
			//如果同时对应的是翻转图片，显示控制按钮的翻转态
			if(this.props.arrange.isInverse){
				controllerunitClassName+=" is-inverse";
			}
		}
		
		return(
			<span className={controllerunitClassName} onClick={this.handleClick}></span>
		)
	}
};
class AppComponent extends React.Component {
	constructor(props) {
        super(props);
	    this.Constant ={
	    	centerPos:{
	    		left:0,
	    		right:0
	    		
	    	},
	    	hPosRange:{//水平方向的取值范围
	    		leftSecX:[0,0],
	    		rightSecX:[0,0],
	    		y:[0,0]
	    	},
	    	vPosRange:{//垂直方向的取值范围
	    		x:[0,0],
	    		topY:[0,0]
	    	}
	    };
      this.state = {
	      imgsArrangeArr: [
	        //{
	        //  pos:{
	        //    left:'0',
	        //    top:'0'
	        //  },
	        //    rotate:0, //旋转角度
	        //isInverse:false, //正反面
	        //isCenter:false 图片是否居中
	        //}
	      ]
      };
     };
     /**
      * 翻转图片
      * @param  index 输入当前被执行inwerse操作的图片的对应的图片信息数组的index
      * return {function} 这是一个闭包函数，其内return一个真正待被执行的函数
      * 
      */
      inverse(index){
       	 return () => {
		      let imgsArrangArr = this.state.imgsArrangeArr;
		      imgsArrangArr[index].isInverse = !imgsArrangArr[index].isInverse;
		      this.setState({
		        imgsArrangeArr: imgsArrangArr
      })
    }
       }
     /*  inserse(index){
       	return function(){
       		var imgsArrangeArr=this.state.imgsArrangeArr;
       		imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;
       		this.setState({
       			imgsArrangeArr:imgsArrangeArr
       		});
       	}.bind(this);
       }*/
	    /*
	     * 重新布局所有图片 随意的布局
	     * @param 指定居中排布哪个图片
	     */
	    rearrange(centerIndex){
	    	var imgsArrangeArr=this.state.imgsArrangeArr,
	    	    Constant=this.Constant,
	    	    //中心图片的位置信息
	    	    centerPos=Constant.centerPos,
	    	    //图片水平方向的取值范围 包括左边和右边区域
	    	    hPosRange=Constant.hPosRange,
	    	    //图片竖直方向的取值范围 包括左边和右边
	    	    vPosRange=Constant.vPosRange,
	    	    //左侧区域的图片的水平方向的取值范围
	    	    hPosRangeLeftSecX=hPosRange.leftSecX,
	    	    //右侧区域的图片水平方向的取值范围
	    	    hPosRangeRightSecX=hPosRange.rightSecX,
	    	    //左侧和右侧区域的图片的竖直方向的取值范围
	    	    hPosRangeY=hPosRange.y,
	    	    //上侧区域的图片的竖直方向的取值范围
	    	    vPosRangeTopY=vPosRange.topY,
	    	    //上侧区域的图片的水平方向的取值范围
	    	    vPosRangeX=vPosRange.x,
	    	    //上侧区域放的图片
	    	    imgsArrangeTopArr=[],
	    	    //上侧区域放0到1张图片
	    	    topImgNum=Math.floor(Math.random()*2),
	    	    //上侧图片的索引 初始化为0
	    	    topImgSpliceIndex=0,
	    	    //取imgsArrangeArr所有的图片中的位置为centerIndex的那一个图片的信息  返回值就是这个中间的图片
	    	    imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);
	    	    //首先居中 centerIndex的图片??????
	    	    imgsArrangeCenterArr[0].pos=centerPos;
	    	    //居中图片不需要旋转
	    	    imgsArrangeCenterArr[0].rotate=0;
	    	    imgsArrangeCenterArr[0].isCenter=true;
	    	    //取出要布局上侧的图片的状态信息
	    	    topImgSpliceIndex=Math.floor(Math.random()*(imgsArrangeArr.length-topImgNum));
	    	    //实例化上侧图片的信息数组
	    	    imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
	    	    //布局位于上侧的图片
	    	    imgsArrangeTopArr.forEach(function(value,index){
	    	    	imgsArrangeTopArr[index]={
	    	    		pos:{
	    	    			top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
	    	    		    left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
	    	    		},
	    	    		rotate:get30Rangedom(),
	    	    		isCenter:false
	    	    		
	    	    	};
	    	    	
	    	    });
	    	    //布局左右两侧的图片信息
	    	    
	    	    for(var i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
	    	    	var hPosRangeLORX=null;
	    	    	//前半部分布局左边，后半部分布局右边
	    	    	if(i<k){
	    	    		hPosRangeLORX=hPosRangeLeftSecX;
	    	    	}else{
	    	    		hPosRangeLORX=hPosRangeRightSecX;
	    	    	}
	    	    	imgsArrangeArr[i]={
	    	    		pos:{
	    	    			top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
	    	    		    left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
	    	    		},
	    	    		rotate:get30Rangedom(),
	    	    		isCenter:false
	    	    		
	    	    	}
	    	    	
	    	    }
	    	    //开始合并
	    	    	//上侧图片
	    	    	if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
	    	    		imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
	    	    	}
	    	    	//中心元素
	    	    	imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
	    	    	this.setState({
	    	    		imgsArrangeArr:imgsArrangeArr
	    	    	})
	    	    
	    	    
	    };
	    /**
	     * 
	     */
	    center(index){
	    	return function(){
	    		this.rearrange(index);
	    	}.bind(this);
	    }
	    //state变化 视图重新渲染
	    getInitialState(){
	    	return {
	    		imgsArrangeArr:[
	    		{
	    			/*pos:{
	    				left:'0',
	    				top:'0'
	    			},
	    			rotate:0,
	    			isInverse:false,
	    			isCenter:false
	    			*/
	    			
	    		}
	    		]
	    	}
	    };
	    //加载组件后，为每张图片计算其位置的范围
	    componentDidMount(){
	    	//首先拿到舞台的大小
	    	var stageDom=ReactDOM.findDOMNode(this.refs.stage),
	    	stageW=stageDom.scrollWidth,
	    	stageH=stageDom.scrollHeight,
	    	halfStageW=Math.ceil(stageW/2),
	    	halfStageH=Math.ceil(stageH/2);
	    	//拿到一个imageFigure的大小
	    	var imgFigureDOM=ReactDOM.findDOMNode(this.refs.imgFigure0),
	    	imgW=imgFigureDOM.scrollWidth,
	    	imgH=imgFigureDOM.scrollHeight,
	    	halfImgW=Math.floor(imgW/2),
	    	halfImgH=Math.floor(imgH/2);
	    	//计算中心图片的位置点
	    	this.Constant.centerPos={
	    		left:halfStageW-halfImgW,
	    		top:halfStageH-halfImgH
	    	}
	       //计算左侧,右侧区域图片排布的取值范围
			this.Constant.hPosRange.leftSecX[0] = -halfImgW;
			this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
			
			this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
			this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
			
			this.Constant.hPosRange.y[0] = -halfImgH;
			this.Constant.hPosRange.y[1] = stageH - halfImgH;
			//计算上测区域图片排布的取值范围
			this.Constant.vPosRange.topY[0] = -halfImgH;
			this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
			
			this.Constant.vPosRange.x[0] = halfStageW - imgW;
			this.Constant.vPosRange.x[1] = halfStageW;
			//调用排序函数
			
            this.rearrange(0);
	    };
		render() {
			var controllerUnits = [];
			var imgFigures = [];
			//为每一个图片天剑一个索引是为以后为每一个图片定位
		imageDatas.forEach((value, index) =>{
       if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate:0,
          isInverse:false,
          isCenter:false
          
          
        }
      }
      imgFigures.push(<ImgFigure data = {value} ref={'imgFigure'+index}  
      arrange={this.state.imgsArrangeArr[index]} key={index} inverse={this.inverse(index)} center={this.center(index)}/>);
      
      controllerUnits.push(<ControllerUnit  arrange={this.state.imgsArrangeArr[index]} key={index} inverse={this.inverse(index)} center={this.center(index)}/>);
    });

				return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
		};
		}

		AppComponent.defaultProps = {};

		export default AppComponent;