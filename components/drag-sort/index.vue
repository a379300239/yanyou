<template>
  <movable-area class="drag-sort" :style="{height: currentListLength + 'px'}" id="drag">
    <movable-view
    v-for="(site, index) in currentList"
    :key="index"
    :x="0"
    :y="site.y"
    direction="vertical"
    :animation="false"
	disabled
    class="drag-sort-item"
    :class="{'active': active === index, 'vh-1px-t': site.index > 0}">
	  
		<image
			:src="iconUrl+site.siteType+iconUrl_houZhui"/>
		
		<view class="item">
			
			<view class="routeEditCss_right_site_text">
				<p class="routeEditCss_right_site_number">No.{{index+1}}</p>
				<p
					v-if="site.siteType=='site' || site.siteType=='food' ||site.siteType=='hotel'"
					class="routeEditCss_right_site_siteName"
				>{{site.siteName}}</p>
				
				<p
					v-if="site.siteType=='traffic'"
					class="routeEditCss_right_site_siteName"
				>{{site.startPlace}}-{{site.endPlace}} {{site.vehicle}}</p>
				
				<p
					v-if="site.siteType=='custom'"
					class="routeEditCss_right_site_siteName"
				>{{site.title}}</p>
					
			</view>
			
			<view class="touch-tight" v-if="!isDeleting">
			  <view class="ico_drag"></view>
			</view>
			
			<view v-if="isDeleting">
				<checkbox @click="choose_delete(index)"></checkbox>
			</view>
			
		</view>
	  
	  
    </movable-view>
	
    <movable-view
	v-if="!isDeleting"
    class="touch"
    :x="2000"
    @touchstart="touchstart"
    @touchmove="touchmove"
    @touchend="touchend"
    catchtouchstart
    catchtouchmove
    catchtouchend></movable-view>
  </movable-area>
</template>

<script>
export default {
  name: 'drag-sort',
  mixins: [],
  components: {},
  data () {
    return {
      height: 100, // 高度
      currentList: [],
      active: -1, // 当前激活的item
      itemIndex: 0, // 当前激活的item的原index
      topY: 0, // 距离顶部的距离
      deviationY: 0 ,// 偏移量
	  iconUrl:'/static/modifySite/',//图标url
	  iconUrl_houZhui:'.png',
	  deleteArry:[]
    }
  },
  computed: {
    currentListLength (){
		// console.log(this.currentList.length,this.height)
      return this.currentList.length * this.height
    }
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    props: {
      type: Object,
      default: () => {
        return {
          label: 'label',
          value: 'value'
        }
      }
    },
	isDeleting:{
		type:Boolean,
		default:()=>{
			return false
		}
	}
  },
  watch: {
    list (val) {
      this.onUpdateCurrentList()
    }
  },
  created () {
    this.onUpdateCurrentList()
  },
  mounted () {
  },
  updated () {},
  filters: {},
  methods: {
	//删除相关
	choose_delete(index){
		this.$emit('choose_delete',index);
	},
	startDeleting:function(e){
		console.log(e);
	},
	
	
    onUpdateCurrentList () {
      let arr = []
      for (const key in this.list) {
        arr.push({
          ...this.list[key],
          index: Number(key),
          y: key * this.height,
          animation: true
        })
      }
      this.currentList = arr
    },
    touchstart (e) {
      // 计算y轴点击位置
      var query = wx.createSelectorQuery().in(this)
      query.select('#drag').boundingClientRect()
      query.exec((res) => {
        this.topY = res[0].top
        let touchY = e.mp.touches[0].clientY - res[0].top
        this.deviationY = touchY % this.height
        // console.log(touchY)
        for (const key in this.currentList) {
          if ((this.currentList[key].index * this.height < touchY) && ((this.currentList[key].index + 1) * this.height > touchY)) {
            this.active = Number(key)
            this.itemIndex = this.currentList[key].index
            break
          }
        }
      })
    },
    touchmove (e) {
      if (this.active < 0) return
      let touchY = (e.mp.touches[0].clientY - this.topY) - this.deviationY
      // console.log(touchY)
      this.currentList[this.active].y = touchY
      for (const key in this.currentList) {
        // 跳过当前操作的item
        if (this.currentList[key].index !== this.currentList[this.active].index) {
          if (this.currentList[key].index > this.currentList[this.active].index) {
            if (touchY > this.currentList[key].index * this.height - this.height / 2) {
              this.currentList[this.active].index = this.currentList[key].index
              this.currentList[key].index = this.currentList[key].index - 1
              this.currentList[key].y = this.currentList[key].index * this.height
              break
            }
          } else {
            if (touchY < this.currentList[key].index * this.height + this.height / 2) {
              this.currentList[this.active].index = this.currentList[key].index
              this.currentList[key].index = this.currentList[key].index + 1
              this.currentList[key].y = this.currentList[key].index * this.height
              break
            }
          }
        }
      }
    },
    touchend (e) {
      if ((this.itemIndex !== this.currentList[this.active].index) && (this.active > -1)) {
        this.$emit('change', {
          // 操作值
          data: (() => {
            let data = {
              ...this.currentList[this.active]
            }
            delete data.index
            delete data.y
            delete data.animation
            return this.active
          })(),
          // 插队的位置前面的值
          frontData: (() => {
            for (const iterator of this.currentList) {
              if (this.currentList[this.active].index - 1 === iterator.index) {
                let data = {
                  ...iterator
                }
                delete data.index
                delete data.y
                delete data.animation
                return iterator.index
              }
            }
          })()
        })
      }
      this.currentList[this.active].animation = true
      this.currentList[this.active].y = this.currentList[this.active].index * this.height
      this.active = -1
    }
  }
}
</script>

<style lang='less' scoped>
@import "~./1px.less";
.drag-sort {
  width: 100%;
}
.drag-sort-item {
  position: absolute !important;
  display: flex;
  align-items: center;
  width: 100%;
  /* padding: 0; */
  margin: 0;
  background: #fff;
  padding: 80rpx 10rpx 80rpx 10rpx;
  box-sizing: border-box;
  overflow: hidden;
  .item {
    display: flex;
	align-items: center;
	justify-content: space-between;
	width: 400rpx;
  }
  .touch-tight {
    width: 24px;
    display: flex;
    justify-content: center;
  }
}

.drag-sort-item image{
	width: 62rpx;
	height: 62rpx;
	margin: 0 20px 0 15px;
	
}

.touch {
  height: 100%;
  width: 50px;
}
.ico_drag {
  display: inline-block;
  width: 24px;
  height: 12px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAYCAYAAAC8/X7cAAAAAXNSR0IArs4c6QAAAEtJREFUWAnt1cEJACAMA0B1/506moIr5FEK51+Jl0d2Vd01+JzB2X90H5jeoPwECBDIBLYlzgDj25Y4JvQAAQIERgtY4u76LHF3Aw8rGQnK3sYAXQAAAABJRU5ErkJggg==) 0 0 no-repeat;
  background-size: 100% auto;
}
.active {
  box-shadow: 0 0 40rpx #DDDDDD;
  z-index: 99;
}

/* 我加的 */
.routeEditCss_right_site{
	display: flex;
	align-items: center;
	/* height: 152rpx; */
	overflow: hidden;
}

.routeEditCss_right_site_text{
}

.routeEditCss_right_site_number{
	font-size: 39rpx;
	color: #666666;
}

.routeEditCss_right_site_siteName{
	font-size: 45rpx;
	color: #333333;
}

</style>
