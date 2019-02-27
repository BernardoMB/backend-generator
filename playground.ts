const myFunction = () => {
    return new Promise(() => {
        throw 'No mames';
    });
}

myFunction().then().catch((err) => {
    console.log(err);
});