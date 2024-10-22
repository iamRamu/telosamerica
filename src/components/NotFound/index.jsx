import './index.css'

const NotFound = () => {
    return(
        <div className='notfound-page'>
            <img src='https://i.pinimg.com/564x/9a/7c/58/9a7c58b1532f43d69be0dcaec9130495.jpg' className='not-found-img'/>
            <h1 className='oops'>Oops!</h1>
            <h3 className='wrong-page'>We can't seem to find the page you're looking for.</h3>
            <h4 className='error-code'>Error code: 404</h4>
        </div>
    )
}
export default NotFound