/**
 * npm
 * https://www.npmjs.com/package/ali-oss
 * github
 * https://github.com/ali-sdk/ali-oss
 * aliyun
 * https://help.aliyun.com/zh/oss/developer-reference/use-temporary-access-credentials-provided-by-sts-to-access-oss
 * 由 requestFunction 接口申请并签发指定路径和权限的临时访问凭证（STS），前端使用该凭证访问 OSS
 */
import OSS, {
  Options,
  MultipartUploadOptions,
  MultipartUploadResult,
} from "ali-oss";
import { getStorage, setStorage } from "..";

/**
 * 初始化 myOSS 函数参数
 */
export interface InitOSSOptions {
  /**
   * 获取 stsInfo 函数参数
   */
  getStsInfoOptions: GetStsInfoOptions;
  /**
   * 创建 OSS 实例参数，默认从 stsInfo 中获取
   */
  ossOptions?: Options;
}

/**
 * 获取 stsInfo 函数参数
 */
export interface GetStsInfoOptions {
  /**
   * stsInfo 本地存储类型，默认 sessionStorage
   */
  storageType?: "localStorage" | "sessionStorage";
  /**
   * stsInfo 本地存储键名，默认 "STS_INFO"
   */
  storageKey?: string;
  /**
   * stsInfo 本地存储提前到期毫秒数，默认5分钟: 5 * 60 * 1000
   */
  expirationBefore?: number;
  /**
   * stsInfo 接口请求函数
   */
  requestFunction: (requestParams?: any) => Promise<StsInfo>;
  /**
   * stsInfo 接口请求参数
   */
  requestParams?: any;
}

/**
 * stsInfo 接口返回参数
 */
export interface StsInfo {
  accessKeyId: Options["accessKeyId"];
  accessKeySecret: Options["accessKeySecret"];
  stsToken: Options["stsToken"];
  /**
   * 出于安全性考虑，stsInfo 必须设置过期时间，否则不读写本地存储
   */
  expiration?: number;
  requestId?: number;
  /**
   * STS 授权的 OSS 相对路径前缀，以/结尾
   * @example "project_1/userId_123/"
   */
  prefix?: string;
  projectName?: string;
}

/**
 * - MyOSS 类继承自 OSS
 * - 由静态函数 initOSS 创建实例，以确保 stsInfo 有效
 * - 重写部分 OSS 同名方法
 */
export class MyOSS extends OSS {
  ossOptions: Options;
  /**
   * stsInfo 接口返回参数
   */
  stsInfo: StsInfo;

  /**
   * 1. MyOSS.getStsInfo
   * 2. return new MyOSS
   */
  static async initOSS(initOSSOptions: InitOSSOptions): Promise<MyOSS> {
    const { getStsInfoOptions, ossOptions = {} } = initOSSOptions;

    try {
      const stsInfo = await MyOSS.getStsInfo(getStsInfoOptions);

      const _ossOptions: Options = {
        ...ossOptions,
        accessKeyId: stsInfo.accessKeyId,
        accessKeySecret: stsInfo.accessKeySecret,
        stsToken: stsInfo.stsToken,
      };

      const myOSS = new MyOSS(_ossOptions, stsInfo);

      return myOSS;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取 stsInfo 函数，两个来源：
   * 1. 本地存储 storageType, storageKey
   * 2. 接口请求 requestFunction, requestParams
   */
  static async getStsInfo(
    getStsInfoOptions: GetStsInfoOptions,
  ): Promise<StsInfo> {
    const {
      storageType = "sessionStorage",
      storageKey = "STS_INFO",
      expirationBefore = 5 * 60 * 1000,
    } = getStsInfoOptions;

    const stsInfo = getStorage<StsInfo>(storageType, storageKey);
    if (
      stsInfo?.accessKeyId &&
      stsInfo?.accessKeySecret &&
      stsInfo?.stsToken &&
      stsInfo?.expiration &&
      new Date().getTime() + expirationBefore <
        new Date(stsInfo.expiration).getTime()
    ) {
      // 如果有本地存储 stsInfo，有过期时间，且没到过期时间，直接返回
      return stsInfo;
    }

    try {
      const stsInfo = await getStsInfoOptions.requestFunction(
        getStsInfoOptions.requestParams,
      );
      if (
        stsInfo?.accessKeyId &&
        stsInfo?.accessKeySecret &&
        stsInfo?.stsToken
      ) {
        if (stsInfo.expiration) {
          setStorage(storageType, storageKey, stsInfo);
        }
        return stsInfo;
      }

      throw new Error("缺少必要接口返回参数");
    } catch (error) {
      throw error;
    }
  }

  constructor(ossOptions: Options, stsInfo: StsInfo) {
    super(ossOptions);
    this.ossOptions = ossOptions;
    this.stsInfo = stsInfo;
  }

  /**
   * 重写 multipartUpload 方法，简化参数
   * @param name 文件名，除 oss 基准地址外的相对路径，由 stsInfo.prefix 指定
   * - example: `${myOSS.stsInfo.prefix}directory/filename.ext`
   * @param file 文件对象，常见如 blob
   */
  multipartUpload(
    name: string,
    file: any,
    options: MultipartUploadOptions = {},
  ): Promise<MultipartUploadResult> {
    return super.multipartUpload(name, file, {
      ...options,
      parallel: options.parallel ?? 4, // 并发数，默认4
      partSize: options.partSize ?? 1024 * 1024, // 分片大小，默认1MB
    });
  }
}
