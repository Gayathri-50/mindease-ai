import { motion } from "framer-motion"

function Navbar() {

return (

<motion.div

initial={{
opacity:0,
y:-20
}}

animate={{
opacity:1,
y:0
}}

className="
glass
glow
rounded-3xl
px-6
py-4
sm:px-8
sm:py-5
flex
flex-col
sm:flex-row
justify-between
items-start
sm:items-center
gap-4
mb-6
sm:mb-8
"

>

<div>

<h1
className="
text-2xl
sm:text-3xl
font-bold
bg-gradient-to-r
from-purple-400
to-pink-400
bg-clip-text
text-transparent
"
>

MindEase

</h1>

<p
className="
text-sm
text-gray-400
mt-1
"
>

AI Wellness Dashboard

</p>

</div>

<div
className="
flex
gap-2
sm:gap-3
w-full
sm:w-auto
"
>

<button
className="
bg-white/10
px-4
sm:px-5
py-2
rounded-2xl
text-sm
sm:text-base
"
>

Home

</button>

<button
className="
bg-white/10
px-4
sm:px-5
py-2
rounded-2xl
text-sm
sm:text-base
"
>

Journal

</button>

<button
className="
bg-gradient-to-r
from-purple-600
to-pink-500
px-4
sm:px-5
py-2
rounded-2xl
text-sm
sm:text-base
"
>

Profile

</button>

</div>

</motion.div>

)

}

export default Navbar