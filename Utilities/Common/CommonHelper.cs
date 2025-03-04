﻿using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace LIB.Utilities.Common
{
    public static class CommonHelper
    {
        public static bool GetParamWithKey(string Token, out JArray objParr, string EncryptApi)
        {
            objParr = null;
            try
            {

                Token = Token.Replace(" ", "+");
                // var serializer = new JavaScriptSerializer();                
                var jsonContent = GetContentObject(Token, EncryptApi);
                objParr = JArray.Parse("[" + jsonContent + "]");
                if (objParr != null && objParr.Count > 0)
                {
                    return true;
                }
                else { return false; }
            }
            catch 
            {
                return false;
            }
        }

        public static string GetContentObject(string sContentEncode, string sKey)
        {
            try
            {
                // api.insidekp: Key quy uoc giua  2 ben | parramKey: tham so dong
                sContentEncode = sContentEncode.Replace(" ", "+");

                string data = Decode(sContentEncode, sKey); // Lay ra content 
                return data;
            }
            catch 
            {
                // ErrorWriter.WriteLog(System.Web.HttpContext.Current.Server.MapPath("~"), "GiaiMa()", ex.ToString());
                return string.Empty;
            }

        }
        public static string Decode(string strString, string strKeyPhrase)
        {
            try
            {
                byte[] byt = Convert.FromBase64String(strString);
                strString = System.Text.Encoding.UTF8.GetString(byt);
                strString = KeyED(strString, strKeyPhrase);
                return strString;
            }
            catch 
            {

                return strString;
            }
        }
        public static string Encode(string strString, string strKeyPhrase)
        {
            try
            {
                strString = KeyED(strString, strKeyPhrase);
                byte[] byt = System.Text.Encoding.UTF8.GetBytes(strString);
                strString = Convert.ToBase64String(byt);
                return strString;
            }
            catch 
            {
                return string.Empty;
            }

        }
        private static string KeyED(string strString, string strKeyphrase)
        {
            int strStringLength = strString.Length;
            int strKeyPhraseLength = strKeyphrase.Length;

            System.Text.StringBuilder builder = new System.Text.StringBuilder(strString);

            for (int i = 0; i < strStringLength; i++)
            {
                int pos = i % strKeyPhraseLength;
                int xorCurrPos = strString[i] ^ strKeyphrase[pos];
                builder[i] = Convert.ToChar(xorCurrPos);
            }

            return builder.ToString();
        }


        public static string RemoveUnicode(string text)
        {
            string[] arr1 = new string[] { "á", "à", "ả", "ã", "ạ", "â", "ấ", "ầ", "ẩ", "ẫ", "ậ", "ă", "ắ", "ằ", "ẳ", "ẵ", "ặ",
    "đ",
    "é","è","ẻ","ẽ","ẹ","ê","ế","ề","ể","ễ","ệ",
    "í","ì","ỉ","ĩ","ị",
    "ó","ò","ỏ","õ","ọ","ô","ố","ồ","ổ","ỗ","ộ","ơ","ớ","ờ","ở","ỡ","ợ",
    "ú","ù","ủ","ũ","ụ","ư","ứ","ừ","ử","ữ","ự",
    "ý","ỳ","ỷ","ỹ","ỵ",};
            string[] arr2 = new string[] { "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a",
    "d",
    "e","e","e","e","e","e","e","e","e","e","e",
    "i","i","i","i","i",
    "o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o",
    "u","u","u","u","u","u","u","u","u","u","u",
    "y","y","y","y","y",};
            for (int i = 0; i < arr1.Length; i++)
            {
                text = text.Replace(arr1[i], arr2[i]);
                text = text.Replace(arr1[i].ToUpper(), arr2[i].ToUpper());
            }
            return text;
        }

        public static string genLinkNews(string Title, string article_id)
        {
            Title = Title.ToLower();
            Title = RemoveUnicode(CheckMaxLength(Title.Trim(), 100));
            Title = RemoveSpecialCharacters(CheckMaxLength(Title.Trim(), 100));
            Title = Title.Replace(" ", "-").ToLower();
            return "/" + Title + "-" + article_id + ".html";
        }


        // xử lý chuỗi quá dài
        //str: Chuoi truyen vao
        // So ky tu toi da cho phep
        // OUPUT: Tra ra chuoi sau khi xu ly
        public static string CheckMaxLength(string str, int MaxLength)
        {
            try
            {
                //str = RemoveSpecialCharacters(str);
                if (str.Length > MaxLength)
                {

                    str = str.Substring(0, MaxLength + 1); // cat chuoi
                    if (str != " ") //  ky tu sau truoc khi cat co chua ky tu ko
                    {
                        while (str.Last().ToString() != " ") // cat not cac cu tu chu cho den dau cach gan nhat
                        {
                            str = str.Substring(0, str.Length - 1); // dich trai
                        }
                    }
                    //str = str + "...";
                }
                return str;
            }
            catch 
            {
                // Utilities.Common.WriteLog(Models.Contants.FOLDER_LOG, "ERROR CheckMaxLength : " + ex.Message);
                return string.Empty;
            }
        }

        public static string RemoveSpecialCharacters(string input)
        {
            try
            {
                Regex r = new Regex("(?:[^a-z0-9 ]|(?<=['\"])s)", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant | RegexOptions.Compiled);
                return r.Replace(input, string.Empty);
            }
            catch (Exception e)
            {
                return input ?? string.Empty;
            }
        }





        public static string ConvertAllNonCharacterToSpace(string text)
        {
            string rs = Regex.Replace(text, @"\s+", " ", RegexOptions.Singleline);
            return rs.Trim();
        }
        /// <summary>
        /// Attempts to match the supplied pattern to the input
        /// string. Only obtains a single match and returns the
        /// matching string if successful and an empty string if not.
        /// </summary>
        /// <param name="inputString">String to be searched</param>
        /// <param name="regExPattern">Pattern to be matched</param>
        /// <returns>String match or empty string if match not found</returns>
        public static string GetSingleRegExMatch(string inputString, string regExPattern)
        {
            string msg;
            string result = "";
            try
            {
                Match match = Regex.Match(inputString,
                    regExPattern,
                    RegexOptions.Singleline);
                if (match.Success)
                {
                    result = match.Value;
                }
            }
            catch (ArgumentException ex)
            {
                msg = regExPattern;
            }

            return result;
        }
        public static string RemoveAllNonCharacter(string text)
        {
            string rs = Regex.Replace(text, @"\s+", "", RegexOptions.Singleline);
            return rs.Trim();
        }
        public static string RemoveUnusedTags(this string source)
        {
            return Regex.Replace(source, @"<(\w+)\b(?:\s+[\w\-.:]+(?:\s*=\s*(?:""[^""]*""|'[^']*'|[\w\-.:]+))?)*\s*/?>\s*</\1\s*>", string.Empty, RegexOptions.Multiline);
        }
        public static T ConvertFromJsonString<T>(string jsonString)
        {
            try
            {
                T rs = JsonConvert.DeserializeObject<T>(jsonString);
                return rs;
            }
            catch
            {
                return default;
            }

        }
        public static string DecodeHTML(string html)
        {
            string result = "";
            try
            {
                result = HttpUtility.HtmlDecode(html);
            }
            catch
            {
                string msg = "Unable to decode HTML: " + html;
                throw new ArgumentException(msg);
            }

            return result;
        }
        public static string RemoveSpecialCharacterExceptVietnameseCharacter(string text)
        {
            string pattern = "/[^a-zA-Z0-9àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ ]/g";
            return Regex.Replace(text, pattern, "");
        }
        public static string RemoveAllSpecialCharacterinURL(string text)
        {
            string pattern = "/[^a-zA-Z0-9àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ/.-_: ]/g";
            return Regex.Replace(text, pattern, "");
        }
        public static string RemoveAllSpecialCharacterLogin(string text)
        {
            string pattern = "/[^a-zA-Z0-9.-_+/= ]/g";
            return Regex.Replace(text, pattern, "");
        }
    }
}
