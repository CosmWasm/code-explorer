import {
  isMsgExecuteContract as isLaunchpadMsgExecuteContract,
  isMsgInstantiateContract as isLaunchpadMsgInstantiateContract,
  isMsgStoreCode as isLaunchpadMsgStoreCode,
} from "@cosmjs/cosmwasm";
import { fromBase64 } from "@cosmjs/encoding";
import { isMsgSend as isLaunchpadMsgSend, Msg, pubkeyType, WrappedStdTx } from "@cosmjs/launchpad";
import { Registry } from "@cosmjs/proto-signing";
import { codec } from "@cosmjs/stargate";
import Long from "long";

type IAny = codec.google.protobuf.IAny;
type ITx = codec.cosmos.tx.v1beta1.ITx;

const { Tx } = codec.cosmos.tx.v1beta1;
const { SignMode } = codec.cosmos.tx.signing.v1beta1;
const { PublicKey } = codec.tendermint.crypto;

export const msgSendTypeUrl = "/cosmos.bank.v1beta1.MsgSend";
export const msgStoreCodeTypeUrl = "/cosmwasm.wasm.v1beta1.MsgStoreCode";
export const msgInstantiateContractTypeUrl = "/cosmwasm.wasm.v1beta1.MsgInstantiateContract";
export const msgExecuteContractTypeUrl = "/cosmwasm.wasm.v1beta1.MsgExecuteContract";

export interface AnyMsgSend {
  readonly type_url: "/cosmos.bank.v1beta1.MsgSend";
  readonly value: Uint8Array;
}

export interface AnyMsgStoreCode {
  readonly type_url: "/cosmwasm.wasm.v1beta1.MsgStoreCode";
  readonly value: Uint8Array;
}

export interface AnyMsgInstantiateContract {
  readonly type_url: "/cosmwasm.wasm.v1beta1.MsgInstantiateContract";
  readonly value: Uint8Array;
}

export interface AnyMsgExecuteContract {
  readonly type_url: "/cosmwasm.wasm.v1beta1.MsgExecuteContract";
  readonly value: Uint8Array;
}

export function isAnyMsgSend(msg: IAny): msg is AnyMsgSend {
  return msg.type_url === msgSendTypeUrl && !!msg.value;
}

export function isAnyMsgStoreCode(msg: IAny): msg is AnyMsgStoreCode {
  return msg.type_url === "/cosmos.bank.v1beta1.MsgStoreCode" && !!msg.value;
}

export function isAnyMsgInstantiateContract(msg: IAny): msg is AnyMsgInstantiateContract {
  return msg.type_url === "/cosmos.bank.v1beta1.MsgInstantiateContract" && !!msg.value;
}

export function isAnyMsgExecuteContract(msg: IAny): msg is AnyMsgExecuteContract {
  return msg.type_url === "/cosmos.bank.v1beta1.MsgExecuteContract" && !!msg.value;
}

/* eslint-disable @typescript-eslint/camelcase */
function launchpadMsgToStargateMsg(typeRegistry: Registry, msg: Msg): IAny {
  if (isLaunchpadMsgSend(msg)) {
    return {
      type_url: msgSendTypeUrl,
      value: typeRegistry.encode({
        typeUrl: msgSendTypeUrl,
        value: {
          fromAddress: msg.value.from_address,
          toAddress: msg.value.to_address,
          amount: msg.value.amount,
        },
      }),
    };
  }
  if (isLaunchpadMsgStoreCode(msg)) {
    return {
      type_url: msgStoreCodeTypeUrl,
      value: typeRegistry.encode({
        typeUrl: msgStoreCodeTypeUrl,
        value: {
          sender: msg.value.sender,
          wasmByteCode: msg.value.wasm_byte_code,
          source: msg.value.source,
          builder: msg.value.builder,
          instantiatePermission: msg.value.instantiate_permission,
        },
      }),
    };
  }
  if (isLaunchpadMsgInstantiateContract(msg)) {
    return {
      type_url: msgInstantiateContractTypeUrl,
      value: typeRegistry.encode({
        typeUrl: msgInstantiateContractTypeUrl,
        value: {
          sender: msg.value.sender,
          codeId: msg.value.code_id,
          label: msg.value.label,
          initMsg: msg.value.init_msg,
          initFunds: msg.value.init_funds,
          admin: msg.value.admin,
        },
      }),
    };
  }
  if (isLaunchpadMsgExecuteContract(msg)) {
    return {
      type_url: msgExecuteContractTypeUrl,
      value: typeRegistry.encode({
        typeUrl: msgExecuteContractTypeUrl,
        value: {
          sender: msg.value.sender,
          contract: msg.value.contract,
          msg: msg.value.msg,
          sentFunds: msg.value.sent_funds,
        },
      }),
    };
  }
  throw new Error("msg type not recognised");
}

export function launchpadTxToStargateTx(typeRegistry: Registry, tx: WrappedStdTx): Uint8Array {
  const stargateTx: ITx = {
    body: {
      messages: tx.value.msg.map((msg) => {
        const stargateMsg = launchpadMsgToStargateMsg(typeRegistry, msg);
        return {
          typeUrl: stargateMsg.type_url ?? "",
          value: stargateMsg.value,
        };
      }),
      memo: tx.value.memo,
    },
    authInfo: {
      signerInfos: tx.value.signatures.map(({ pub_key }) => ({
        publicKey: {
          type: "/tendermint.crypto.PublicKey",
          value: PublicKey.encode(
            PublicKey.create({
              ed25519: pub_key.type === pubkeyType.ed25519 ? fromBase64(pub_key.value) : null,
              secp256k1: pub_key.type === pubkeyType.secp256k1 ? fromBase64(pub_key.value) : null,
            }),
          ).finish(),
        },
        modeInfo: { single: { mode: SignMode.SIGN_MODE_LEGACY_AMINO_JSON } },
        // TODO: Use real values
        sequence: Long.fromNumber(0),
      })),
      fee: {
        amount: [...tx.value.fee.amount],
        gasLimit: Long.fromString(tx.value.fee.gas),
        // TODO: Use real values
        payer: undefined,
        // TODO: Use real values
        granter: undefined,
      },
    },
    signatures: tx.value.signatures.map(({ signature }) => fromBase64(signature)),
  };
  return Tx.encode(Tx.create(stargateTx)).finish();
}
/* eslint-enable @typescript-eslint/camelcase */
