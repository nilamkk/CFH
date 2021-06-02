const getCategory=(rating)=>{
    if(rating<1200)
        return "newbie"
    if(1200<=rating && rating<1400)
        return "pupil"
    if(1400<=rating&& rating<1600)
        return "specialist"
    if(1600<=rating && rating<1900)
        return "expert"
    if(1900<=rating && rating<2100)
        return "candidate master"
    if(2100<=rating && rating<2300 )
        return "master"
    if(2300<=rating && rating<2400)
        return "international master"
    if(2400<=rating && rating<2600 )
        return "grandmaster"
    if(2600<=rating && rating<3000)
        return "international grandmaster"
    return "legendary grandmaster"
}

module.exports={getCategory}
