import { Grid, GridItem } from '@chakra-ui/react';
import { useActiveWeb3React } from '../../../hooks/web3';
import { useYamatoStateForPledge } from '../../../state/yamato-entirety/hooks';
import { ItemTitleForPledge } from '../../CommonItem';
import RedemptionInput from './RedemptionInput';

export default function SelfRedemption() {
  const { account, library } = useActiveWeb3React();

  const yamato = useYamatoStateForPledge();

  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={4} mb={12}>
      <GridItem colSpan={1}>
        <ItemTitleForPledge marginTop={32}>償還</ItemTitleForPledge>
      </GridItem>

      <GridItem colSpan={3}>
        <RedemptionInput
          totalCollateral={yamato.totalCollateral}
          totalDebt={yamato.totalDebt}
          tcr={yamato.tcr}
          rateOfEthJpy={yamato.rateOfEthJpy}
        />
      </GridItem>
    </Grid>
  );
}