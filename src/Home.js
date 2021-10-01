import React from 'react'
import Movies from './containers/Movies/Movies';
import Toolbar from './components/Navigation/Toolbar/Toolbar';
import Aux from './hoc/Aux/Aux';
const Home = () => {
  return (
    <Aux>
      <main>
        <Movies />
        
      </main>
    </Aux>
  )
}

export default Home
