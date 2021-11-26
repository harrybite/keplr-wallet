import React, { FunctionComponent, useRef, useState } from "react";

import { Input } from "../../components/form";

import { Button, Form, Tooltip } from "reactstrap";

import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import { Banner } from "../../components/banner";
import useForm from "react-hook-form";

import { EmptyLayout } from "../../layouts/empty-layout";

import style from "./style.module.scss";

import { FormattedMessage, useIntl } from "react-intl";
import { useInteractionInfo } from "@keplr-wallet/hooks";
import { useHistory } from "react-router";
import delay from "delay";

interface FormData {
  password: string;
}

export const LockPage: FunctionComponent = observer(() => {
  const intl = useIntl();
  const history = useHistory();
  const [isOnCapsLock, setIsOnCapsLock] = useState(false);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, setError, errors } = useForm<FormData>({
    defaultValues: {
      password: "",
    },
  });
  const ref = register({
    required: intl.formatMessage({
      id: "lock.input.password.error.required",
    }),
  });

  const { keyRingStore, analyticsStore } = useStore();
  const [loading, setLoading] = useState(false);

  const interactionInfo = useInteractionInfo(() => {
    keyRingStore.rejectAll();
  });

  return (
    <EmptyLayout style={{ backgroundColor: "white", height: "100%" }}>
      <Form
        className={style.formContainer}
        onSubmit={handleSubmit(async (data) => {
          setLoading(true);
          try {
            await keyRingStore.unlock(data.password);
            analyticsStore.logEvent("Account unlocked", {
              authType: "password",
            });
            if (interactionInfo.interaction) {
              if (!interactionInfo.interactionInternal) {
                // XXX: If the connection doesn't have the permission,
                //      permission service tries to grant the permission right after unlocking.
                //      Thus, due to the yet uncertain reason, it requests new interaction for granting permission
                //      before the `window.close()`. And, it could make the permission page closed right after page changes.
                //      Unfortunately, I still don't know the exact cause.
                //      Anyway, for now, to reduce this problem, jsut wait small time, and close the window only if the page is not changed.
                await delay(100);
                if (window.location.href.includes("#/unlock")) {
                  window.close();
                }
              } else {
                history.replace("/");
              }
            }
          } catch (e) {
            console.log("Fail to decrypt: " + e.message);
            setError(
              "password",
              "invalid",
              intl.formatMessage({
                id: "lock.input.password.error.invalid",
              })
            );
            setLoading(false);
          }
        })}
      >
        <Banner
          icon={require("../../public/assets/temp-icon.svg")}
          logo={require("../../public/assets/logo-temp.png")}
          subtitle="Wallet for the Interchain"
        />
        <Input
          type="password"
          label={intl.formatMessage({
            id: "lock.input.password",
          })}
          name="password"
          error={errors.password && errors.password.message}
          ref={(e) => {
            ref(e);
            passwordRef.current = e;
          }}
          onKeyUp={(e) => {
            if (e.getModifierState("CapsLock")) {
              setIsOnCapsLock(true);
            } else {
              setIsOnCapsLock(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.getModifierState("CapsLock")) {
              setIsOnCapsLock(true);
            } else {
              setIsOnCapsLock(false);
            }
          }}
        />
        <Button type="submit" color="primary" block data-loading={loading}>
          <FormattedMessage id="lock.button.unlock" />
        </Button>

        {passwordRef && passwordRef.current && (
          <Tooltip
            arrowClassName={style.capslockTooltipArrow}
            placement="top-start"
            isOpen={isOnCapsLock}
            target={passwordRef.current}
            fade
          >
            <FormattedMessage id="lock.alert.capslock" />
          </Tooltip>
        )}
      </Form>
    </EmptyLayout>
  );
});
