import { useSelector } from "react-redux"
import { selectCurrentUser } from "../../store/slices/authSlice"
import { Link } from "react-router-dom"

const Welcome = () => {
    const user = useSelector(selectCurrentUser)

    const welcome = user ? `Welcome ${user}!` : 'Welcome'

    const content = (
        <section>
            <h1>{welcome}</h1>
        </section>
    )
    return content
}

export default Welcome