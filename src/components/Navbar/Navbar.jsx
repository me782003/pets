import { FaCartShopping, FaChevronRight, FaList, FaListUl } from 'react-icons/fa6'
import userImg from  '../../assets/images/avatarUser.png';
import './style.css';
import { Menu } from '../../assets/svgIcons';
import { MenuFoldOutlined } from '@ant-design/icons';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';

export default function Navbar({showSide  , setShowSide}) {
  return (
    <header className="navbar ">
      <AnimatePresence>

      {
        !showSide &&
        <motion.div whileHover={{scale:1.1}} initial={{x:"-100%"}} animate={{x:0}} exit={{x:"-100vw"}}  className=' open_sidebar fs-4 pointer' onClick={()=> setShowSide(true)}><FaChevronRight/></motion.div>
      }
      </AnimatePresence>

       <div className="header-data">
         {/* <div className='profile_cart'>
             <FaCartShopping />
             <span>0</span>
         </div> */}

         <div className='profile_data'>
            <p className='m-0'>Big Company</p>
            <img src={userImg}/>
         </div>
       </div>
    </header>
  )
}
