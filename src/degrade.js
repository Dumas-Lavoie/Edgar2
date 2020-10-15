
  var granimInstance = new Granim({
    element : '#degra_canv',
    name : 'granim',
    opacity : [1,0.5],
    states : {
        "default-state": {
            gradients: [
                [
                    { color: '#0D3750', pos: .3 },
                    { color: '#EB5C5E', pos: .9 }
                 ],

                 [
                    { color: '#0D3750', pos: .1 },
                    { color: '#EB5C5E', pos: .6 }
                 ]
                 // Optionne
            ]
        }
    }
})  

