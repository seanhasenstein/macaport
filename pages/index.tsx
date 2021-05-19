import Layout from '../components/Layout';
import Hero from '../components/Hero';
import Colors from '../components/Colors';
import Pricing from '../components/Pricing';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Colors />
      <Pricing />
    </Layout>
  );
}
