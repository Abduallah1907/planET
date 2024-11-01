import { useAppSelector, useAppDispatch } from '../../store/hooks';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Dropdown, DropdownItem, Image } from 'react-bootstrap';
import "./avatar.css";
import { setLoginState } from '../../store/userSlice';
import { closeSidebar, disableSidebar, setNavItems } from '../../store/sidebarSlice';
import { TouristService } from '../../services/TouristService';
import { AdvertiserService } from '../../services/AdvertiserService';
import { SellerServices } from '../../services/SellerServices';

const Avatar: React.FC = () => {
    const user = useAppSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();



    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem('user');
            dispatch(setLoginState(false));
            dispatch(disableSidebar());
            dispatch(closeSidebar());
            dispatch(setNavItems([]));
            navigate('/');
        }
    }
    const handleDelete = async() => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            switch (user.role) {
            case "TOURIST":
                await TouristService.deleteTourist(user.email);
                break;
            case "ADVERTISER":
                await AdvertiserService.deleteAdvertiser(user.email);
                break;
            case "SELLER":
                await SellerServices.deleteSellerServices(user.email);
                break
            }

            localStorage.removeItem('user');
            dispatch(setLoginState(false));
            dispatch(disableSidebar());
            dispatch(closeSidebar());
            dispatch(setNavItems([]));
            navigate('/');

        }
    }
    return (
        <Dropdown drop='down' align='end' className='px-2'>
            <Dropdown.Toggle

                variant="secondary"
                style={{ backgroundColor: '#D3D3D3' }}
                id="avatar-dropdown"
                className='custom-dropdown-toggle'
            >
                <Image
                    src="https://i.pinimg.com/564x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg"
                    roundedCircle
                    width="30"
                    height="30"
                />
            </Dropdown.Toggle>
            <Dropdown.Menu className='custom-dropdown-menu'>
                <Dropdown.Item as={Link} to={`/${user.role}/Profile`}>Profile</Dropdown.Item>
                {user.role=="TOURIST"||
                user.role=="TOUR_GUIDE"||
                user.role=="ADVERTISER"||
                user.role=="SELLER"?
                <Dropdown.Item>
                    <Button variant="danger" onClick={handleDelete} className='w-100'>Delete Account</Button>
                </Dropdown.Item>:null}
                <Dropdown.Divider />
                <Dropdown.Item>
                    <Button variant="danger" onClick={handleLogout} className='w-100'>Logout</Button>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>

    );
}

export default Avatar;