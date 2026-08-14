import Layout from '../components/Layout';
import Hero from '../components/home/Hero';
import ValueProps from '../components/home/ValueProps';
import Apparel from '../components/home/Apparel';
import TeamStores from '../components/home/TeamStores';
import GangSheetSpotlight from '../components/home/GangSheetSpotlight';
import TrustLine from '../components/home/TrustLine';

export default function Home() {
  return (
    <Layout
      title="Macaport | Custom Apparel, Team Stores & DTF Gang Sheets"
      description="Custom apparel and embroidery in New London, Wisconsin. Online team stores for your group, or build and buy a DTF gang sheet in minutes."
    >
      <Hero />
      <ValueProps />
      {/* Apparel and team stores are the same buyer deciding how their group
          orders, so they belong next to each other. Gang sheets is a different
          customer entirely — shops and resellers pressing their own — and sat
          between the two, making that buyer change subject and change back.
          Anyone here for gang sheets has the hero calculator and the nav. */}
      <Apparel />
      <TeamStores />
      <GangSheetSpotlight />
      <TrustLine />
    </Layout>
  );
}
