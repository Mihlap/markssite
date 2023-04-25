import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Header/Header';
import Company from './Company/Company';
import Competentions from './Competentions/Competentions';
import Contacts from './Contacts/Contacts';
import NotFound from './NotFound/NotFound';
import Portal from './Portal/Portal';
import Project from './Project/Project';
import Publics from './Publics/Publics';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Header />} />
      <Route path="/competention" element={<Competentions />} />
      <Route path="/project" element={<Project />} />
      <Route path="/public" element={<Publics />} />
      <Route path="/company" element={<Company />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/portal" element={<Portal />} />
      <Route path="*" element={<NotFound />} />
     </Routes>
  )
}

export default App;
