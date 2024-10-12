import './searchbar.css';
import { useTranslation } from 'react-i18next';
const SearchBar = () => {
  const { t } = useTranslation();
  return (
    <div >
      <input type="text" className='search m-md-3' placeholder={t(" search")} />
    </div>
  );
};

export default SearchBar;
