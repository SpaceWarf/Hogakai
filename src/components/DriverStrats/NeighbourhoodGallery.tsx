import "./DriverStrats.scss";
import Header from "../Common/Header"
import { useSelector } from "react-redux";
import { getDriverStratsByNeighbourhood } from "../../redux/selectors/driversStrats";
import { RootState } from "../../redux/store";
import Gallery from "../Common/Gallery";
import { useNavigate, useParams } from "react-router-dom";
import NewStratModal from "./NewStratModal";
import { DriverStrat, DriverStratTag } from "../../redux/reducers/driverStrats";
import { GalleryItem } from "../../state/gallery";
import { DatabaseTable, deleteItem } from "../../utils/firestore";
import { useAuth } from "../../contexts/AuthContext";
import ExpandStratModal from "./ExpandStratModal";
import { useState, useEffect } from "react";

function NeighbourghoodGallery() {
  const { user } = useAuth();
  const { neighbourhood } = useParams();
  const navigate = useNavigate();
  const neighbourhoods = useSelector((state: RootState) => state.neighbourhoods.neighbourhoods);
  const driverStratsMap = useSelector(getDriverStratsByNeighbourhood);
  const [orderedItems, setOrderedItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const items = (driverStratsMap.get(neighbourhood) || [])
      .sort((a: DriverStrat, b: DriverStrat) => {
        return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
      })
      .map((strat: DriverStrat) => ({
        id: strat.id,
        embed: strat.embed,
        notes: strat.notes,
        tags: strat.tags,
      }));
    setOrderedItems(items);
  }, [driverStratsMap, neighbourhood]);

  const getNeighbourhoodFromParams = () => {
    const hood = neighbourhoods.find(hood => hood.id === neighbourhood);

    if (hood) {
      return hood.name;
    } else {
      navigate("/driver-strats")
    }
  }

  const handleDelete = async (id: string) => {
    await deleteItem(DatabaseTable.DRIVER_STRATS, id, user);
  }

  return (
    <div className="NeighbourghoodGallery">
      <Header text={`${getNeighbourhoodFromParams()} Strats`} decorated />
      <div className="content">
        <div className="actions">
          <p className="hyperlink-button" onClick={() => navigate('/driver-strats')}><i className='arrow left icon' /> back</p>
          {neighbourhood && <NewStratModal neighbourhood={neighbourhood} />}
        </div>
        <Gallery
          items={orderedItems}
          tags={Object.values(DriverStratTag)}
          onDelete={handleDelete}
          expandModal={<ExpandStratModal />}
        />
      </div>
    </div>
  );
}

export default NeighbourghoodGallery;