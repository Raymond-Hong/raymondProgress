export default 
{
    touchFn:function(fn,dr_name){
        return {
            bind:function(el,binding){
                new fn(el,binding,dr_name);
            }
        }
    },
    'qaload-more':function(){
        return {
            bind:(el,binding)=>{
            el.addEventListener('touchmove', () => {
              if(document.body.scrollHeight-30<=screen.height+document.body.scrollTop){
                binding.value();
              }
            }, false)
          }
        }
    },
    derection:[
        'tap',
        'swipe',
        'swipeleft',
        'swiperight',
        'swipedown',
        'swipeup',
        'longtap',
        'qaload-more'
    ]
}