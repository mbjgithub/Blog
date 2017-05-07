
module.exports=Reve.component("nav",{
	data:function(){
    return {
        isLogin:false,
        showProfile:false
      }
	},
	methods:{
       onMouseover:function(){
          if(this.$data.isLogin){
             this.$data.showProfile=true
             this.$update()
          }
       },
       onMouseout:function(){
       	   this.$data.showProfile=false
       	   this.$update()
       }
	}
})

