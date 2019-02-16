package com.yangrui.util.math;

/**
 * @autor 杨瑞
 * @date 2019/2/5 19:32
 */
public class RandomUtil {

    private static final String[] s={"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L"};

    public static String randNum(int len){
        StringBuilder builder=new StringBuilder();
        int path=s.length;
        for(int i=0;i<len;i++){
            int sm= (int) (Math.random()*path);
            builder.append(s[sm]);
        }
        return builder.toString();
    }

}
