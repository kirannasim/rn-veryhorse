export function email_validate(email)
{
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(reg.test(email))
    {
        return true;
    }
    else
    {
        return false;
    }
}

export function demandamount(price)
{
    return parseFloat(price) + (parseFloat(price) * 0.12);
}

export function payamount(price)
{
    var number = (parseFloat(price) * 0.12);
    return Math.round(parseFloat(number) * (Math.pow(10,2))) / Math.pow(10,2);
}