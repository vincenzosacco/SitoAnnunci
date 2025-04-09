package org.unical.utils;

import java.net.MalformedURLException;

public class Urls {

    public static boolean isValidUrl(String url) {
        try {
            new java.net.URL(url);
            return true;
        } catch (MalformedURLException e) {
            return false;
        }
    }
}
