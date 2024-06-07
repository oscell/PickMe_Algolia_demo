import UI from './components/Search/Search';
import RestaurantsTab from './components/RestaurantsTab/RestaurantsTab';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/restaurants" element={<RestaurantsTab />} />
          <Route path="/" element={<UI />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;