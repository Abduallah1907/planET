import { useAppContext } from "../../AppContext";
import FlightsSearchBar from "../../components/FlightsSearchBar";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function FlightsPage() {
    const navigate = useNavigate();
    const { currency } = useAppContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [filtercomponent, setfilterComponents] = useState({});
    const [sortBy, setSortBy] = useState("topPicks"); // State for sort by selection
    const [filter, setFilter] = useState({});

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value,
        });
    };

    const handleFilterSubmit = () => {
        setfilterComponents(filter);
    };

    return (
        <div className="bg-main p-5">
            <Container>
                <FlightsSearchBar />
            </Container>
        </div>
    )
}