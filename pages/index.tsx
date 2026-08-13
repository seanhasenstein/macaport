import Layout from '../components/Layout';
import Hero from '../components/home/Hero';
import ValueProps from '../components/home/ValueProps';
import Apparel from '../components/home/Apparel';
import GangSheetSpotlight from '../components/home/GangSheetSpotlight';
import TeamStores from '../components/home/TeamStores';
import TrustLine from '../components/home/TrustLine';

export default function Home() {
  return (
    <Layout
      title="Macaport | Custom Apparel, Team Stores & DTF Gang Sheets"
      description="Custom apparel and embroidery in New London, Wisconsin. Online team stores for your group, or build and buy a DTF gang sheet in minutes."
    >
      <Hero />
      <ValueProps />
      <Apparel />
      <GangSheetSpotlight />
      <TeamStores />
      <TrustLine />
    </Layout>
  );
}
