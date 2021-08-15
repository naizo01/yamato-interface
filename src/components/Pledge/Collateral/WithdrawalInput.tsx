import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { Formik, Form, Field, FormikHelpers, FieldProps } from 'formik';
import { useState } from 'react';
import { YAMATO_SYMBOL } from '../../../constants/yamato';
import useInterval from '../../../hooks/useInterval';
import { useWithdrawCollateral } from '../../../state/pledge/hooks';
import { subtractToNum } from '../../../utils/bignumber';
import { formatCollateralizationRatio } from '../../../utils/prices';

type Props = { collateral: number; debt: number; withdrawalLockDate: number };

export default function WithdrawalInput(props: Props) {
  const withdrawCollateral = useWithdrawCollateral();

  const [withdrawal, setWithdrawal] = useState(0);
  const [remainLockTime, setRemainLockTime] = useState(-1);

  useInterval(() => {
    if (!props.withdrawalLockDate || !remainLockTime) {
      return;
    }
    const now = Math.floor(Date.now() / 1000);
    setRemainLockTime(props.withdrawalLockDate - now);
  }, 500);

  function validateWithdrawal(value: number) {
    if (value == null || typeof value !== 'number') {
      return '数値で入力してください。';
    }
    if (value > props.collateral) {
      return '残高を超えています。';
    }

    // Value is correct
    setWithdrawal(value);
    return undefined;
  }

  function submitWithdrawal(
    values: { withdrawal: number },
    formikHelpers: FormikHelpers<{
      withdrawal: number;
    }>
  ) {
    console.log('submit withdrawal', values);
    withdrawCollateral(values.withdrawal);

    // reset
    setWithdrawal(0);
    formikHelpers.resetForm();
  }

  return (
    <Formik initialValues={{ withdrawal: 0 }} onSubmit={submitWithdrawal}>
      {(formikProps) => (
        <Form>
          <VStack spacing={4} align="start">
            <HStack spacing={4} align="flex-end">
              <Field name="withdrawal" validate={validateWithdrawal}>
                {({ field, form }: FieldProps) => (
                  <FormControl
                    isInvalid={
                      !!form.errors.withdrawal && !!form.touched.withdrawal
                    }
                    style={{ maxWidth: '200px' }}
                  >
                    <FormLabel htmlFor="withdrawal">引出量入力</FormLabel>
                    <Input
                      {...field}
                      id="withdrawal"
                      type="number"
                      placeholder={YAMATO_SYMBOL.COLLATERAL}
                    />
                    <FormErrorMessage>
                      {form.errors.withdrawal}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                colorScheme="teal"
                isLoading={formikProps.isSubmitting}
                type="submit"
              >
                引出実行
              </Button>
            </HStack>
            {withdrawal > 0 && (
              <HStack spacing={4} align="flex-end">
                <label>変動予測値表示</label>
                <span>
                  {subtractToNum(props.collateral, withdrawal)}
                  {YAMATO_SYMBOL.COLLATERAL}
                  {', 担保率'}
                  {formatCollateralizationRatio(
                    props.collateral - withdrawal,
                    props.debt
                  )}
                  %
                </span>
              </HStack>
            )}
            {remainLockTime > 0 && (
              <HStack spacing={4} align="flex-end">
                <label>ロックタイムカウントダウン </label>
                <span>
                  {format(remainLockTime * 1000, 'あとdd日HH時mm分ss秒')}
                </span>
              </HStack>
            )}
          </VStack>
        </Form>
      )}
    </Formik>
  );
}