import { FC } from 'react';

const Hero: FC = () => {
    return (
        <div className="wrapper">
            <div className="container">
                <div className="hero-texts">
                    <div className="hero appear appear-first">
                        <h1 className="first-gradient">
                            ENTER.
                        </h1>
                    </div>
                    <div className="hero appear appear-second">
                        <h1 className="second-gradient">
                            PLAY.
                        </h1>
                    </div>
                    <div className="hero appear appear-third">
                        <h1 className="third-gradient">
                            WIN.
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;