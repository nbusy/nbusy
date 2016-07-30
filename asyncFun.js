async function asyncFun() {
    return await Promise.resolve(1);
}

exports.asyncResult = asyncFun();