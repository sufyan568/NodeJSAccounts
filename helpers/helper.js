module.exports = {
    format : 'A4',
    orientation : 'portrait',
    border : '8mm',
    header: {
        height : '15mm',
        contents :'<h4>User Credit & Debit Details</h4>',
    },
    footer:{
        height: '20mm',
        contents:
        {
            first : 'Cover page',
            2 : 'Second Page',
            default :'<h5> {{pages}} </h5>',
            last :'Last Page',
        },
    }
}