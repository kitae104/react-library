import { Carousel } from "./components/Carousel";
import { ExploreTopBooks } from "./components/ExploreTopBooks";
import { Heros } from "./components/Heros";
import { LibrayServices } from "./components/LibrayServices";

export const HomePage: React.FC<{}> = () => {
    return (
        <>            
            <ExploreTopBooks />
            <Carousel />
            <Heros />
            <LibrayServices />            
        </>
    );
};