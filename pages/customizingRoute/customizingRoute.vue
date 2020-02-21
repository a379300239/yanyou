<template>
	<view style="width: 100%; background: #FAFAFA;">
		
		<p style="padding-top: 8%;">定制路线</p>

		<!-- <drag id="drag" ref="drag"  @click="itemClick" :columns="1" :list-data="listData" :top="110" :bottom="300" @change="change"></drag> -->
		
		<view>
			<dragSort :list="list" :props="props" @change="onDragSortChange"></dragSort>
		</view>
		
		
	</view>
</template>

<script>
	import dragSort from '@/components/drag-sort/index.vue'
	export default {
		data() {
			return {
				props:{
					label: 'siteName'
				},
				 list: [
				        {
				          siteName: '标题1'
				        },
				        {
				          siteName: '标题2'
				        },
				        {
				          siteName: '标题3'
				        },
				        {
				          siteName: '标题4'
				        },
				        {
				          siteName: '标题5'
				        },
				      ],
			}
		},
		components: {
			dragSort,
		},
		methods: {
			onDragSortChange:function(e){
			},
		},
	}
</script>

<style>

</style>
