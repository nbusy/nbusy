async function asyncFun() {
    const res = await Promise.resolve(1);
    console.log('inside await: ', res);
    return res;
}

exports.asyncResult = asyncFun();