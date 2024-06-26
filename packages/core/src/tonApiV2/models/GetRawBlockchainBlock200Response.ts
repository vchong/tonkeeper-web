/* tslint:disable */
/* eslint-disable */
/**
 * REST api to TON blockchain explorer
 * Provide access to indexed TON blockchain
 *
 * The version of the OpenAPI document: 2.0.0
 * Contact: support@tonkeeper.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { BlockRaw } from './BlockRaw';
import {
    BlockRawFromJSON,
    BlockRawFromJSONTyped,
    BlockRawToJSON,
} from './BlockRaw';

/**
 * 
 * @export
 * @interface GetRawBlockchainBlock200Response
 */
export interface GetRawBlockchainBlock200Response {
    /**
     * 
     * @type {BlockRaw}
     * @memberof GetRawBlockchainBlock200Response
     */
    id: BlockRaw;
    /**
     * 
     * @type {string}
     * @memberof GetRawBlockchainBlock200Response
     */
    data: string;
}

/**
 * Check if a given object implements the GetRawBlockchainBlock200Response interface.
 */
export function instanceOfGetRawBlockchainBlock200Response(value: object): value is GetRawBlockchainBlock200Response {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('data' in value) || value['data'] === undefined) return false;
    return true;
}

export function GetRawBlockchainBlock200ResponseFromJSON(json: any): GetRawBlockchainBlock200Response {
    return GetRawBlockchainBlock200ResponseFromJSONTyped(json, false);
}

export function GetRawBlockchainBlock200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetRawBlockchainBlock200Response {
    if (json == null) {
        return json;
    }
    return {
        
        'id': BlockRawFromJSON(json['id']),
        'data': json['data'],
    };
}

export function GetRawBlockchainBlock200ResponseToJSON(value?: GetRawBlockchainBlock200Response | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'id': BlockRawToJSON(value['id']),
        'data': value['data'],
    };
}

