const Test = () =>{
    let res = async (x) => x+10;
    res(10).then(t => console.info(t));
}
export default Test;