import {useDispatch, useSelector} from "react-redux";

const Home = () => {

    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.user);
    return (
        <div>
            <h1>Home Page</h1>
            {/*<p>Welcome to the home page, {user.name}</p>*/}

            <p>Name: {user.name}</p>
        </div>
    );
}

export default Home;